import { parseActionSurfaceDefinitions } from './action-surface';

describe('parseActionSurfaceDefinitions', () => {
  it('accepts a custom control with declarative and schema fallbacks', () => {
    const surfaces = parseActionSurfaceDefinitions({
        compose: {
            contract: 'process.email.compose/v1',
            modes: ['proposal', 'receipt'],
        targets: ['process-chat', 'slack', 'sms', 'apple-messages'],
        renderers: [
          { kind: 'element-react', uiKey: 'ui.gmailSend' },
          {
            kind: 'declarative',
            renderer: 'json-render',
            document: { layout: 'email-compose' },
          },
          {
            kind: 'static-preview',
            assetKey: 'ui.gmailSend/preview-4x.png',
            mimeType: 'image/png',
            alt: 'Gmail email review',
            width: 720,
            height: 480,
            pixelRatio: 4,
            activateCommand: 'open',
          },
          { kind: 'schema' },
        ],
        bindings: {
          to: { source: 'input', path: 'to', access: 'read-write' },
          sender: { source: 'connection', path: 'account.email', access: 'read' },
        },
        commands: {
          send: { intent: 'execute' },
          open: { intent: 'open-in-process' },
        },
      },
    });

    expect(surfaces.compose?.contract).toBe('process.email.compose/v1');
    expect(surfaces.compose?.modes).toEqual(['proposal', 'receipt']);
  });

  it('only lets a static preview activate trusted Process navigation', () => {
    expect(() => parseActionSurfaceDefinitions({
      compose: {
        contract: 'process.email.compose/v1',
        renderers: [{
          kind: 'static-preview',
          assetKey: 'ui.gmailSend/preview-4x.png',
          mimeType: 'image/png',
          alt: 'Gmail email review',
          width: 720,
          height: 480,
          pixelRatio: 4,
          activateCommand: 'send',
        }],
        bindings: {},
        commands: { send: { intent: 'execute' } },
      },
    })).toThrow('preview must activate an open-in-process command');
  });

  it('keeps execution bindings read-only', () => {
    expect(() => parseActionSurfaceDefinitions({
      receipt: {
        contract: 'process.email.compose/v1',
        modes: ['receipt'],
        renderers: [{ kind: 'schema' }],
        bindings: {
          status: { source: 'execution', path: 'status', access: 'read-write' },
        },
      },
    })).toThrow('cannot write policy, connection, or execution state');
  });

  it('rejects unsafe remote UI keys', () => {
    expect(() => parseActionSurfaceDefinitions({
      compose: {
        contract: 'process.email.compose/v1',
        renderers: [{ kind: 'element-react', uiKey: '../secrets' }],
        bindings: {},
      },
    })).toThrow('unsafe UI key');
  });

  it('keeps policy and connection bindings read-only', () => {
    expect(() => parseActionSurfaceDefinitions({
      compose: {
        contract: 'process.email.compose/v1',
        renderers: [{ kind: 'schema' }],
        bindings: {
          policy: { source: 'policy', path: 'decision', access: 'read-write' },
        },
      },
    })).toThrow('cannot write policy, connection, or execution state');
  });
});
