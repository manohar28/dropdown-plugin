import {
  closest as domClosest
} from 'min-dom';

import react from 'react';

import InputEditor from 'dmn-js-decision-table/lib/features/decision-table-head/editor/components/InputCell';
import CustomInputCellContextMenu from './CustomInputCellContextMenu';


export default class CustomInputCellProvider {

  constructor(components, contextMenu, eventBus, renderer) {

    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'input-header') {
        return InputCell;
      }
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (
        context.contextMenuType === 'input-edit'
      ) {
        return CustomInputCellContextMenu;
      }
    });

    eventBus.on('input.edit', ({ event, input }) => {
      const { target } = event;

      const node = domClosest(target, 'th', true);

      const { left, top } = node.getBoundingClientRect();

      contextMenu.open({
        x: left,
        y: top,
        align: 'bottom-right'
      }, {
        contextMenuType: 'input-edit',
        input
      });
    });
  }

}

CustomInputCellProvider.$inject = [
  'components',
  'contextMenu',
  'eventBus',
  'renderer'
];