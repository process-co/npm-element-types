/** A test value only. The editor owns invocation, credentials and transport. */
export type SignalSimulationValue = null | boolean | number | string | SignalSimulationValue[]
  | { [key: string]: SignalSimulationValue };

/** UI keys resolve from this signal's exact compiled build receipt. */
export type SignalSimulationDeclaration = {
  ui?: string;
  sample?: SignalSimulationValue;
};

/** Props for a pure definition-provided event input component. */
export type SignalSimulationUiProps = {
  value: SignalSimulationValue;
  onChange: (value: SignalSimulationValue) => void;
  definition: {
    key: string;
    name?: string | null;
    description?: string | null;
    type?: 'action' | 'signal' | 'source';
    noAuth: boolean;
    props: readonly Record<string, unknown>[];
    [key: string]: unknown;
  };
  configuration: Readonly<Record<string, unknown>>;
  outputSchema?: Readonly<Record<string, unknown>>;
  disabled: boolean;
};
