//! Checkpoint / time-machine shapes (SAD §4.1, §4.6, §9; FR-SNAP-*).

use chrono::{DateTime, Utc};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use super::event::Actor;
use crate::ids::{EnvId, SnapshotId};

/// Who/why a checkpoint was created.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum SnapshotReason {
    UserManual,
    AgentAutoCheckpoint,
    SystemAutoCheckpoint,
    PrePublish,
}

/// Request to create a checkpoint.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct SnapshotSpec {
    pub name: String,
    pub reason: SnapshotReason,
    #[serde(default)]
    pub include_memory: bool,
    /// Marks this as the bundle's "golden" point.
    #[serde(default)]
    pub mark_golden: bool,
}

/// Stored checkpoint reference, as shown on the snapshot timeline.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct SnapshotRef {
    pub id: SnapshotId,
    pub env_id: EnvId,
    pub name: String,
    pub reason: SnapshotReason,
    pub created_by: Actor,
    pub size_bytes: u64,
    pub is_golden: bool,
    pub created_at: DateTime<Utc>,
}