import React from 'react';
import {RendererProps, Renderer} from '../../factory';
import QuickEdit from '../QuickEdit';
import Copyable from '../Copyable';
import PopOverable from '../PopOver';
import {observer} from 'mobx-react';
import omit = require('lodash/omit');

export interface TableCellProps extends RendererProps {
  wrapperComponent?: React.ReactType;
  column: object;
}
export class TableCell extends React.Component<RendererProps> {
  static defaultProps = {
    wrapperComponent: 'td'
  };

  static propsList: Array<string> = [
    'type',
    'label',
    'column',
    'body',
    'tpl',
    'rowSpan',
    'remark'
  ];

  render() {
    let {
      className,
      render,
      style,
      wrapperComponent: Component,
      column,
      value,
      data,
      children,
      width,
      innerClassName,
      label,
      tabIndex,
      onKeyUp,
      rowSpan,
      body: _body,
      tpl,
      remark,
      prefix,
      affix,
      isHead,
      ...rest
    } = this.props;

    const schema = {
      ...column,
      className: innerClassName,
      type: (column && column.type) || 'plain'
    };

    // 如果本来就是 type 为 button，不要删除，其他情况下都应该删除。
    if (schema.type !== 'button' && schema.type !== 'dropdown-button') {
      delete schema.label;
    }

    let body = children
      ? children
      : render('field', schema, {
          ...omit(rest, Object.keys(schema)),
          inputOnly: true,
          value,
          data
        });

    if (width) {
      style = {
        ...style,
        width: (style && style.width) || width
      };

      if (!/%$/.test(String(style.width))) {
        body = (
          <div style={{width: style.width}}>
            {prefix}
            {body}
            {affix}
          </div>
        );
        prefix = null;
        affix = null;
        // delete style.width;
      }
    }

    if (!Component) {
      return body as JSX.Element;
    }

    if (isHead) {
      Component = 'th';
    }

    return (
      <Component
        rowSpan={rowSpan > 1 ? rowSpan : undefined}
        style={style}
        className={className}
        tabIndex={tabIndex}
        onKeyUp={onKeyUp}
      >
        {prefix}
        {body}
        {affix}
      </Component>
    );
  }
}

@Renderer({
  test: /(^|\/)table\/(?:.*\/)?cell$/,
  name: 'table-cell'
})
@QuickEdit()
@PopOverable({
  targetOutter: true
})
@Copyable()
@observer
export class TableCellRenderer extends TableCell {
  static propsList = [
    'quickEdit',
    'quickEditEnabledOn',
    'popOver',
    'copyable',
    'inline',
    ...TableCell.propsList
  ];
}

@Renderer({
  test: /(^|\/)field$/,
  name: 'field'
})
@PopOverable()
@Copyable()
export class FieldRenderer extends TableCell {
  static defaultProps = {
    ...TableCell.defaultProps,
    wrapperComponent: 'div'
  };
}
