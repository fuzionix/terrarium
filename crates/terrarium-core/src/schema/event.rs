//! Unified event envelope. 
//! This is the one and only event shape that flows through observation, the audit JSONL/hash chain, and SSE —
//! the UI must not invent a second shape for desktop-only panes.

use std::fmt;
use std::str::FromStr;

use chrono::{DateTime, Utc};
use schemars::JsonSchema;
use serde::{Deserialize, Deserializer, Serialize, Serializer};

use crate::ids::{AgentId, EnvId, EventId, ProjectId};

/// Who/what performed an action. Shared across events, tool invocations, and snapshot authorship.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum Actor {
    Agent { id: AgentId },
    User { id: Option<String> },
    System,
}

/// Namespace prefix of an `EventType`; drives the log stream's type-chip filter.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum EventNamespace {
    Model,
    Tool,
    Fs,
    Job,
    Net,
    Browser,
    Hitl,
    Snap,
    Publish,
    Sys,
}

impl EventNamespace {
    pub const fn as_str(&self) -> &'static str {
        match self {
            Self::Model => "model",
            Self::Tool => "tool",
            Self::Fs => "fs",
            Self::Job => "job",
            Self::Net => "net",
            Self::Browser => "browser",
            Self::Hitl => "hitl",
            Self::Snap => "snap",
            Self::Publish => "publish",
            Self::Sys => "sys",
        }
    }

    pub fn from_str_opt(s: &str) -> Option<Self> {
        Some(match s {
            "model" => Self::Model,
            "tool" => Self::Tool,
            "fs" => Self::Fs,
            "job" => Self::Job,
            "net" => Self::Net,
            "browser" => Self::Browser,
            "hitl" => Self::Hitl,
            "snap" => Self::Snap,
            "publish" => Self::Publish,
            "sys" => Self::Sys,
            _ => return None,
        })
    }
}

/// Dotted event type such as `fs.write` or `hitl.approved`.
///
/// Serialized on the wire as a single flat string (`"type": "exec.finished"`) to match the SAD contract exactly, 
/// but kept structured in memory so the namespace can be matched exhaustively by the frontend filter.
#[derive(Debug, Clone, PartialEq, Eq, JsonSchema)]
#[schemars(with = "String")]
pub struct EventType {
    pub namespace: EventNamespace,
    pub action: String,
}

impl EventType {
    pub fn new(namespace: EventNamespace, action: impl Into<String>) -> Self {
        Self { namespace, action: action.into() }
    }
}

impl fmt::Display for EventType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}.{}", self.namespace.as_str(), self.action)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct EventTypeParseError;

impl fmt::Display for EventTypeParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "invalid event type: expected \"<namespace>.<action>\"")
    }
}

impl std::error::Error for EventTypeParseError {}

impl FromStr for EventType {
    type Err = EventTypeParseError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (ns, action) = s.split_once('.').ok_or(EventTypeParseError)?;
        let namespace = EventNamespace::from_str_opt(ns).ok_or(EventTypeParseError)?;
        Ok(Self { namespace, action: action.to_string() })
    }
}

impl Serialize for EventType {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_str(&self.to_string())
    }
}

impl<'de> Deserialize<'de> for EventType {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        let raw = String::deserialize(deserializer)?;
        raw.parse().map_err(serde::de::Error::custom)
    }
}

/// Unified event envelope.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct Event {
    /// Schema version of this envelope.
    pub v: u32,
    pub id: EventId,
    pub ts: DateTime<Utc>,
    pub env_id: EnvId,
    pub project_id: ProjectId,
    pub actor: Actor,
    #[serde(rename = "type")]
    pub event_type: EventType,
    pub data: serde_json::Value,
    /// Present once the audit hash chain is enabled.
    pub prev_hash: Option<String>,
    pub hash: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn event_type_round_trips_through_display_and_from_str() {
        let et = EventType::new(EventNamespace::Fs, "write");
        assert_eq!(et.to_string(), "fs.write");
        assert_eq!(et.to_string().parse::<EventType>().unwrap(), et);
    }

    #[test]
    fn event_type_rejects_unknown_namespace() {
        assert!("bogus.write".parse::<EventType>().is_err());
    }
}