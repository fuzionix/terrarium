//! Newtype identifiers used throughout the Environment Contract.
//!
//! Every ID wraps a UUIDv7 so that sorting by ID roughly sorts by creation time without a separate column.
//! The wire format (`Serialize`/`Deserialize`) is the plain UUID string;
//! `Display`/`short()` add the human-readable `<prefix>_...` form used in logs and the UI (Design System: `env_08f2`).

use std::fmt;
use std::str::FromStr;

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

macro_rules! define_id {
    ($name:ident, $prefix:literal) => {
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, JsonSchema)]
        #[serde(transparent)]
        pub struct $name(pub Uuid);

        impl $name {
            pub const PREFIX: &'static str = $prefix;

            /// New time-ordered identifier.
            pub fn new() -> Self {
                Self(Uuid::now_v7())
            }

            /// Short, human-readable form for logs/UI, e.g. `env_08f2c1a0`.
            /// Never parse this back — round-trip via the full UUID instead.
            pub fn short(&self) -> String {
                let hex = self.0.simple().to_string();
                format!("{}_{}", Self::PREFIX, &hex[..8])
            }
        }

        impl Default for $name {
            fn default() -> Self {
                Self::new()
            }
        }

        impl fmt::Display for $name {
            fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                write!(f, "{}_{}", Self::PREFIX, self.0)
            }
        }

        impl FromStr for $name {
            type Err = uuid::Error;

            /// Accepts either a bare UUID or a `<prefix>_<uuid>` string.
            fn from_str(s: &str) -> Result<Self, Self::Err> {
                let raw = s
                    .strip_prefix(Self::PREFIX)
                    .and_then(|rest| rest.strip_prefix('_'))
                    .unwrap_or(s);
                Ok(Self(Uuid::parse_str(raw)?))
            }
        }
    };
}

define_id!(ProjectId, "prj");
define_id!(EnvId, "env");
define_id!(AgentId, "agt");
define_id!(ReviewId, "rev");
define_id!(SnapshotId, "snap");
define_id!(BundleId, "bdl");
define_id!(EventId, "evt");
define_id!(ToolInvocationId, "inv");
define_id!(JobId, "job");
define_id!(McpServerId, "mcp");
define_id!(DeviceTokenId, "dvt");

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn short_form_has_prefix_and_is_stable_length() {
        let id = EnvId::new();
        let short = id.short();
        assert!(short.starts_with("env_"));
        assert_eq!(short.len(), "env_".len() + 8);
    }

    #[test]
    fn from_str_accepts_prefixed_and_bare_forms() {
        let id = ProjectId::new();
        let prefixed = id.to_string();
        let bare = id.0.to_string();

        assert_eq!(ProjectId::from_str(&prefixed).unwrap(), id);
        assert_eq!(ProjectId::from_str(&bare).unwrap(), id);
    }
}