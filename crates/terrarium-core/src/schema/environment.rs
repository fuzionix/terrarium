//! Environment lifecycle resource shapes.

use chrono::{DateTime, Utc};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::error::FailureInfo;
use crate::ids::{EnvId, ProjectId};
use crate::state_machine::{EnvStateKind, RuntimeKind};

/// Environment creation contract.
/// 
/// Intentionally free of host filesystem paths or adapter-specific flags:
/// Resolving `MountSpec::host_ref` to a real path is the Local adapter's `HostMountResolver` responsibility only.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct CreateEnvSpec {
    pub project_id: ProjectId,
    pub image: ImageRef,
    pub resources: ResourceSpec,
    pub network: NetworkPolicy,
    #[serde(default)]
    pub mounts: Vec<MountSpec>,
}

/// Image source for a new environment.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum ImageRef {
    /// Default path: OCI image with CoW overlay + shared layer cache.
    Oci {
        #[serde(rename = "ref")]
        reference: String,
    },
    /// Advanced: user-imported disk image; must pass checksum verification before the environment reaches `Ready`.
    DiskImage {
        #[serde(rename = "ref")]
        reference: String,
    },
    /// Advanced: custom rootfs bundle.
    CustomRootfs {
        #[serde(rename = "ref")]
        reference: String,
    },
}

/// Resource quota.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct ResourceSpec {
    pub vcpu: u32,
    pub memory_mib: u32,
    pub disk_mib: u32,
}

/// Egress-only policy surface. 
/// Inbound is always deny-all and therefore is not a field a project can override.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
#[serde(tag = "mode", rename_all = "snake_case")]
pub enum NetworkPolicy {
    Allowlist { egress: Vec<String> },
    Isolated,
}

/// Host folder mounted into the guest, read-only by default.
/// `host_ref` is an opaque handle chosen by the user via a native file picker — never a raw path exposed across the API boundary.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
pub struct MountSpec {
    pub host_ref: String,
    pub guest_path: String,
    #[serde(default = "default_true")]
    pub ro: bool,
}

fn default_true() -> bool {
    true
}

/// Destroy behavior.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum DestroyMode {
    KeepSnapshots,
    EraseAll,
}

/// Full environment record as returned by `GET /envs/{id}`.
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct Environment {
    pub id: EnvId,
    pub project_id: ProjectId,
    pub image: ImageRef,
    pub state: EnvStateKind,
    pub failure: Option<FailureInfo>,
    pub resources: ResourceSpec,
    pub network: NetworkPolicy,
    pub runtime_kind: RuntimeKind,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}