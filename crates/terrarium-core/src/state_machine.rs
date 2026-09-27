//! Environment lifecycle state machine.
//!
//! This module is deliberately *data only*: the enum, a declarative allowed-transition table, and pure structural predicates. 
//! Actually calling a runtime adapter, persisting the new state, or emitting an event belongs to `terrarium-host`'s `Orchestrator` / `Reconciler`, not here.

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::error::FailureInfo;

/// UI and API must render exactly these values. 
/// Do not invent ad-hoc labels such as "connecting" to stand in for a contract state.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "PascalCase")]
pub enum EnvStateKind {
    Creating,
    Ready,
    Running,
    Paused,
    Snapshotting,
    Restoring,
    Publishing,
    Failed,
    Destroyed,
}

impl EnvStateKind {
    /// States in which `destroy` must be rejected.
    pub const fn blocks_destroy(&self) -> bool {
        matches!(self, Self::Snapshotting | Self::Restoring | Self::Publishing)
    }

    /// States in which writes into the guest must be rejected.
    pub const fn blocks_write(&self) -> bool {
        matches!(self, Self::Restoring | Self::Publishing)
    }

    /// Terminal states; no further transitions are expected out of them except through project deletion.
    pub const fn is_terminal(&self) -> bool {
        matches!(self, Self::Destroyed)
    }
}

/// `(from, to)` pairs only — no side effects.
pub const ALLOWED_TRANSITIONS: &[(EnvStateKind, EnvStateKind)] = &[
    (EnvStateKind::Creating, EnvStateKind::Ready),
    (EnvStateKind::Creating, EnvStateKind::Failed),
    (EnvStateKind::Ready, EnvStateKind::Running),
    (EnvStateKind::Ready, EnvStateKind::Restoring),
    (EnvStateKind::Ready, EnvStateKind::Destroyed),
    (EnvStateKind::Running, EnvStateKind::Paused),
    (EnvStateKind::Running, EnvStateKind::Snapshotting),
    (EnvStateKind::Running, EnvStateKind::Restoring),
    (EnvStateKind::Running, EnvStateKind::Publishing),
    (EnvStateKind::Running, EnvStateKind::Failed),
    (EnvStateKind::Paused, EnvStateKind::Running),
    (EnvStateKind::Paused, EnvStateKind::Destroyed),
    (EnvStateKind::Snapshotting, EnvStateKind::Running),
    (EnvStateKind::Snapshotting, EnvStateKind::Ready),
    (EnvStateKind::Snapshotting, EnvStateKind::Failed),
    (EnvStateKind::Restoring, EnvStateKind::Running),
    (EnvStateKind::Restoring, EnvStateKind::Ready),
    (EnvStateKind::Restoring, EnvStateKind::Failed),
    (EnvStateKind::Publishing, EnvStateKind::Running),
    (EnvStateKind::Publishing, EnvStateKind::Ready),
    (EnvStateKind::Publishing, EnvStateKind::Failed),
    (EnvStateKind::Failed, EnvStateKind::Destroyed),
    (EnvStateKind::Failed, EnvStateKind::Ready),
    (EnvStateKind::Failed, EnvStateKind::Creating),
];

/// Pure structural check against the table above. No I/O, no locking.
pub fn is_transition_allowed(from: EnvStateKind, to: EnvStateKind) -> bool {
    ALLOWED_TRANSITIONS.contains(&(from, to))
}

/// Runtime residency of an environment. Drives the AppBar's "Local MicroVM" / "Remote" indicator.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum RuntimeKind {
    LocalMicrovm,
    Remote,
}

/// Alias kept separate from `EnvStateKind` so the state enum itself stays a plain, hashable discriminant usable as a map key / badge lookup.
pub type EnvFailure = FailureInfo;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn publishing_blocks_destroy_and_write() {
        assert!(EnvStateKind::Publishing.blocks_destroy());
        assert!(EnvStateKind::Publishing.blocks_write());
    }

    #[test]
    fn ready_to_running_is_allowed_but_ready_to_publishing_is_not() {
        assert!(is_transition_allowed(EnvStateKind::Ready, EnvStateKind::Running));
        assert!(!is_transition_allowed(EnvStateKind::Ready, EnvStateKind::Publishing));
    }

    #[test]
    fn destroyed_is_terminal() {
        assert!(EnvStateKind::Destroyed.is_terminal());
    }
}