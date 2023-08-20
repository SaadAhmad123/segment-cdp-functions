export type LanguageType = 'JavaScript' | 'TypeScript';
export type FunctionType = 'Destination' | 'Source';
export type FunctionSettingVariableType =
  | 'ARRAY'
  | 'BOOLEAN'
  | 'STRING'
  | 'TEXT_MAP';

export type FunctionSetting = {
  name: string;
  label: string;
  description: string;
  type: FunctionSettingVariableType;
  required: boolean;
  sensitive: boolean;
};

export type ConfigType = {
  name: string;
  description: string;
  type: FunctionType;
  transpiler: LanguageType;
  directories: {
    source: string;
    build: string;
  };
  segment: {
    settings: Array<FunctionSetting>;
  };
};
