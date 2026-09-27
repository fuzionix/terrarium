//! Stable, i18n-able, searchable error codes and the failure payload attached to `EnvStateKind::Failed`.
//!
//! Rule: never repurpose an existing variant for a new meaning. 
//! Add a new variant instead — this enum is part of the versioned Environment Contract, and its string form is a frontend i18n key (`error.<CODE>`).

use std::fmt;

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ErrorCode {
    // Environment lifecycle
    EnvVirtUnsupported,
    EnvCreateFailed,
    EnvNotFound,
    EnvInvalidStateTransition,
    EnvResourceQuotaExceeded,
    EnvImageNotSelected,
    EnvImageVerifyFailed,

    // Local/Remote runtime engine
    RuntimeEngineNotReady,
    RuntimeSnapshotFailed,
    RuntimeRestoreFailed,

    // HITL / Review Bus
    HitlInsufficientCard,
    HitlApprovalExpired,
    HitlHighRiskNoAutoApprove,
    HitlDecisionConflict,

    // Publish pipeline
    PubUnsignedImage,
    PubUnverifiedBundle,
    PubNetworkPolicyTooPermissive,
    PubTransferFailed,

    // Secrets
    SecretNotFound,
    SecretStoreUnavailable,

    // Model router
    ModelProviderUnreachable,
    ModelToolCallInvalid,

    // MCP
    McpServerUntrustedParams,
    McpServerConnectionFailed,

    // System / reconciliation
    SysReconcileOrphanDestroyed,
    SysInternal,
}

impl ErrorCode {
    /// Machine-readable code string, stable across releases.
    /// Doubles as the frontend i18n message key suffix: `error.<code>`.
    pub const fn as_code_str(&self) -> &'static str {
        match self {
            Self::EnvVirtUnsupported => "ENV_VIRT_UNSUPPORTED",
            Self::EnvCreateFailed => "ENV_CREATE_FAILED",
            Self::EnvNotFound => "ENV_NOT_FOUND",
            Self::EnvInvalidStateTransition => "ENV_INVALID_STATE_TRANSITION",
            Self::EnvResourceQuotaExceeded => "ENV_RESOURCE_QUOTA_EXCEEDED",
            Self::EnvImageNotSelected => "ENV_IMAGE_NOT_SELECTED",
            Self::EnvImageVerifyFailed => "ENV_IMAGE_VERIFY_FAILED",
            Self::RuntimeEngineNotReady => "RUNTIME_ENGINE_NOT_READY",
            Self::RuntimeSnapshotFailed => "RUNTIME_SNAPSHOT_FAILED",
            Self::RuntimeRestoreFailed => "RUNTIME_RESTORE_FAILED",
            Self::HitlInsufficientCard => "HITL_INSUFFICIENT_CARD",
            Self::HitlApprovalExpired => "HITL_APPROVAL_EXPIRED",
            Self::HitlHighRiskNoAutoApprove => "HITL_HIGH_RISK_NO_AUTO_APPROVE",
            Self::HitlDecisionConflict => "HITL_DECISION_CONFLICT",
            Self::PubUnsignedImage => "PUB_UNSIGNED_IMAGE",
            Self::PubUnverifiedBundle => "PUB_UNVERIFIED_BUNDLE",
            Self::PubNetworkPolicyTooPermissive => "PUB_NETWORK_POLICY_TOO_PERMISSIVE",
            Self::PubTransferFailed => "PUB_TRANSFER_FAILED",
            Self::SecretNotFound => "SECRET_NOT_FOUND",
            Self::SecretStoreUnavailable => "SECRET_STORE_UNAVAILABLE",
            Self::ModelProviderUnreachable => "MODEL_PROVIDER_UNREACHABLE",
            Self::ModelToolCallInvalid => "MODEL_TOOLCALL_INVALID",
            Self::McpServerUntrustedParams => "MCP_SERVER_UNTRUSTED_PARAMS",
            Self::McpServerConnectionFailed => "MCP_SERVER_CONNECTION_FAILED",
            Self::SysReconcileOrphanDestroyed => "SYS_RECONCILE_ORPHAN_DESTROYED",
            Self::SysInternal => "SYS_INTERNAL",
        }
    }
}

impl fmt::Display for ErrorCode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.as_code_str())
    }
}

/// Suggested recovery actions surfaced next to a `Failed` state. 
/// The UI renders these as buttons and must never invent an action the backend did not report.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum RecommendedAction {
    Retry,
    Destroy,
    RestoreSnapshot,
    ContactSupport,
}

/// Structured failure payload attached to `EnvStateKind::Failed`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
pub struct FailureInfo {
    pub code: ErrorCode,
    /// Developer-facing diagnostic detail. User-facing text is resolved from `code` via i18n on the frontend — do not localize this field.
    pub detail: Option<String>,
    pub recommended_actions: Vec<RecommendedAction>,
}

/// Library-wide error type. Binaries (CLI, Tauri shell) may wrap this in `anyhow`; 
/// libraries must use this type directly.
#[derive(Debug, Error)]
pub enum TerrariumError {
    #[error("[{code}] {message}")]
    Domain { code: ErrorCode, message: String },

    #[error("invalid state transition: {from:?} -> {to:?}")]
    InvalidStateTransition {
        from: crate::state_machine::EnvStateKind,
        to: crate::state_machine::EnvStateKind,
    },
}

impl TerrariumError {
    pub fn code(&self) -> ErrorCode {
        match self {
            Self::Domain { code, .. } => *code,
            Self::InvalidStateTransition { .. } => ErrorCode::EnvInvalidStateTransition,
        }
    }
}