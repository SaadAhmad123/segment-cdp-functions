export default {
  properties: {
    name: {
      description: 'Name of the variable',
      required: true,
    },
    label: {
      description: 'Display name of the variable',
      required: true,
    },
    description: {
      description: 'The variable description',
      default: 'setting veriable',
      required: true,
    },
    type: {
      description:
        'Data type of the variable (one of ARRAY|BOOLEAN|STRING|TEXT_MAP) <default: STRING>',
      pattern: /ARRAY|BOOLEAN|STRING|TEXT_MAP/,
      message: 'Invalid option. Must be one of ARRAY|BOOLEAN|STRING|TEXT_MAP',
      default: 'STRING',
      required: true,
    },
    required: {
      description:
        'Is the variable required? (Choose Yes or No) <default: Yes>',
      default: 'Yes',
      pattern: /Yes|No/,
      message: 'Invalid option. Can be Yes or No, only',
      required: true,
    },
    sensitive: {
      description:
        'Is the variable sensitive? (Choose Yes or No) <default: Yes>',
      default: 'Yes',
      pattern: /Yes|No/,
      message: 'Invalid option. Can be Yes or No, only',
      required: true,
    },
  },
};
