//! Tool Gateway shapes.

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use super::event::Actor;
use crate::ids::{AgentId, EnvId, ProjectId, ReviewId, ToolInvocationId};

/// Where a tool call came from. 
/// The frontend must always be able to distinguish these — never render an MCP tool as if it were builtin.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum ToolSource {
    Builtin,
    Mcp { server: String, tool: String },
    /// Capability executed directly by the guest tool host (e.g. `jobd`), distinct from a host-side builtin.
    Guest,
}

/// Coarse severity used for sorting/badging.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum RiskClass {
    Low,
    Medium,
    High,
}

/// The non-shrinkable P0 high-risk matrix. 
/// A tool executor MUST NOT let an agent or an MCP server self-declare a lower category than what the static classifier assigns.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum RiskCategory {
    DeleteFileOrDirectory,
    ScheduleModification,
    ArbitraryDomainEgress,
    PackageInstallOrSystemConfig,
    SecretReadOrWrite,
    GuestToHostWrite,
    PublishToCloud,
    RunUnknownBinary,
    Other,
}

/// Project- or tool-level policy action. 
/// Project default is `Ask`; there is no variant for a global permanent `Allow`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum PolicyAction {
    Observe,
    Ask,
    Allow,
}

/// Content provenance flag. 
/// Content pulled from the web or guest files starts as `Untrusted` and must never be silently promoted to an already-approved policy.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum TrustLevel {
    Trusted,
    Untrusted,
}

/// A single tool call as it enters the Tool Gateway.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct ToolInvocation {
    pub id: ToolInvocationId,
    pub project_id: ProjectId,
    pub env_id: EnvId,
    pub agent_id: AgentId,
    pub source: ToolSource,
    pub name: String,
    pub args: serde_json::Value,
    pub risk_category: RiskCategory,
    pub risk_class: RiskClass,
    pub policy_action: PolicyAction,
    pub actor: Actor,
    pub trust: TrustLevel,
}

/// Human decision on a pending review. 
/// Note there is intentionally no "approve forever" variant.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
#[serde(tag = "action", rename_all = "snake_case")]
pub enum Decision {
    ApproveOnce,
    ApproveClass { ttl_seconds: u64 },
    Deny,
    Rewrite { args: serde_json::Value },
    AbortAgent,
}

/// Timeout behavior for an unanswered review. 
/// High-risk categories must never resolve this to an implicit approval.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum TimeoutPolicy {
    PauseWait,
    AutoDeny,
}

/// Compact card shape shared by the desktop review queue and the future mobile push-approval flow.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct ReviewCardSummary {
    pub review_id: ReviewId,
    pub intent_summary: String,
    pub risk_category: RiskCategory,
    pub affected_files_count: u32,
    pub network_targets: Vec<String>,
    pub reversible: bool,
    pub tool_source: ToolSource,
    pub waited_seconds: u64,
    /// When `false`, the UI must disable "approve once" and only allow rewrite/deny (`ErrorCode::HitlInsufficientCard`).
    pub sufficient_for_quick_approve: bool,
}

/// Full detail shown once a summary card is expanded.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct ReviewCardDetail {
    pub summary: ReviewCardSummary,
    pub raw_command_or_patch: String,
    pub diff: Option<String>,
    /// Opaque references to captured browser keyframes, resolved by the observation API — never a raw host path.
    pub browser_keyframes: Vec<String>,
    pub reversibility_note: String,
    pub timeout_policy: TimeoutPolicy,
}