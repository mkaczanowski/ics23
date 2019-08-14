import { proofs } from "./generated/codecimpl";
import { CommitmentRoot, verifyExistence } from "./proofs";

/*
This implements the client side functions as specified in
https://github.com/cosmos/ics/tree/master/spec/ics-023-vector-commitments

In particular:

  // Assumes ExistenceProof
  type verifyMembership = (root: CommitmentRoot, proof: CommitmentProof, key: Key, value: Value) => boolean

  // Assumes NonExistenceProof
  type verifyNonMembership = (root: CommitmentRoot, proof: CommitmentProof, key: Key) => boolean

  // Assumes BatchProof - required ExistenceProofs may be a subset of all items proven
  type batchVerifyMembership = (root: CommitmentRoot, proof: CommitmentProof, items: Map<Key, Value>) => boolean

  // Assumes BatchProof - required NonExistenceProofs may be a subset of all items proven
  type batchVerifyNonMembership = (root: CommitmentRoot, proof: CommitmentProof, keys: Set<Key>) => boolean

We make an adjustment to accept a Spec to ensure the provided proof is in the format of the expected merkle store.
This can avoid an range of attacks on fake preimages, as we need to be careful on how to map key, value -> leaf
and determine neighbors
*/

/**
 * verifyMembership ensures proof is (contains) a valid existence proof for the given
 */
export function verifyMembership(
  proof: proofs.ICommitmentProof,
  spec: proofs.IProofSpec,
  root: CommitmentRoot,
  key: Uint8Array,
  value: Uint8Array
): boolean {
  // TODO: handle batch
  const exist = proof.exist;
  if (!exist) {
    return false;
  }
  try {
    verifyExistence(exist, spec, root, key, value);
    return true;
  } catch {
    return false;
  }
}
