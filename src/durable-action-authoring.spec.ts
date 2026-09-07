import { DurableActionEffectBindingSchema } from './durable-action';
import { CallableResourceReferenceSchema } from './callable-resource';

describe('Durable Action authoring versus execution references', () => {
  it.each(['outlook@main::action:createDraft', 'outlook@v1.2.3::action:createDraft'])('retains authored selector %s without inventing a build', definitionFern => {
    const binding = { kind: 'authored-callable', definitionFern };
    expect(DurableActionEffectBindingSchema.parse(binding)).toEqual(binding);
    expect(CallableResourceReferenceSchema.safeParse(binding).success).toBe(false);
  });

  it('rejects runtime fields and credentials on an authored binding', () => {
    const binding = { kind: 'authored-callable', definitionFern: 'outlook@main::action:createDraft' };
    for (const field of ['runtimeTarget', 'credentialId', 'accessToken']) {
      expect(DurableActionEffectBindingSchema.safeParse({ ...binding, [field]: 'untrusted' }).success).toBe(false);
    }
    expect(DurableActionEffectBindingSchema.safeParse({ ...binding, definitionFern: '  ' }).success).toBe(false);
  });

  it('keeps explicit pins and validates their physical artifact identity', () => {
    const resource = { stableId: 'createDraft', implementationKind: 'action', scope: 'team',
      version: { mode: 'pinned', versionId: 'version-1', versionNumber: 1 },
      runtimeTarget: { artifactIdentity: 'version-1', artifactKey: 'build-1' } };
    expect(DurableActionEffectBindingSchema.safeParse({ kind: 'pinned-callable', resource }).success).toBe(true);
    expect(DurableActionEffectBindingSchema.safeParse({ kind: 'pinned-callable', resource: {
      ...resource, runtimeTarget: { ...resource.runtimeTarget, artifactIdentity: 'version-2' },
    } }).success).toBe(false);
  });
});
