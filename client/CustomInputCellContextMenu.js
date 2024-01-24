import { Component } from 'inferno';

import CustomInputEditor from './CustomInputEditor';

import {
  inject
} from 'table-js/lib/components';



export default class CustomInputCellContextMenu extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {};

    inject(this);

    this.persistChanges = this.debounceInput(this.persistChanges);
  }

  persistChanges = () => {
    const { input } = this.props.context;

    const { unsaved } = this.state;

    if (!unsaved) {
      return;
    }

    const {
      label,
      ...inputExpressionProperties
    } = unsaved;

    var changes = {};

    if ('label' in unsaved) {
      changes.label = label;
    }

    if (hasKeys(inputExpressionProperties)) {
      changes.inputExpression = inputExpressionProperties;
    }

    this.modeling.updateProperties(input, changes);

    this.setState({
      unsaved: false
    });
  };

  handleChange = (changes) => {
    this.setState({
      unsaved: {
        ...this.state.unsaved,
        ...changes
      }
    }, this.persistChanges);
  };

  getValue(attr) {
    let { input } = this.props.context;

    const { unsaved } = this.state;

    let target = input;

    // input variable stored in parent
    if (attr === 'text') {
      target = target.inputExpression;
    }

    return unsaved && attr in unsaved ? unsaved[attr] : target.get(attr);
  }

  render() {
    return (
      <CustomInputEditor
        label={this.getValue('label')}
        text={this.getValue('text')}
        element={this.props.context.input}
        onChange={this.handleChange} />
    );
  }
}

CustomInputCellContextMenu.$inject = [
  'debounceInput',
  'modeling',
  'injector'
];


// helpers //////////////////////

function hasKeys(obj) {
  return Object.keys(obj).length;
}

// export default {
//   __init__: [ 'CustomInputCellContextMenu' ],
//   CustomInputCellContextMenu: [ 'type', CustomInputCellContextMenu ]
// };
