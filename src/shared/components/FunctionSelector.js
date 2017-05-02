import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import {INFLUXQL_FUNCTIONS} from 'src/data_explorer/constants'

class FunctionSelector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      localSelectedItems: this.props.selectedItems,
    }

    this.onSelect = ::this.onSelect
    this.onApplyFunctions = ::this.onApplyFunctions
  }

  onSelect(item, e) {
    e.stopPropagation()

    const {localSelectedItems} = this.state

    let nextItems
    if (this.isSelected(item)) {
      nextItems = localSelectedItems.filter(i => i !== item)
    } else {
      nextItems = localSelectedItems.concat(item)
    }

    this.setState({localSelectedItems: nextItems})
  }

  isSelected(item) {
    return this.state.localSelectedItems.indexOf(item) > -1
  }

  onApplyFunctions(e) {
    e.stopPropagation()

    this.props.onApply(this.state.localSelectedItems)
  }

  render() {
    const {localSelectedItems} = this.state

    return (
      <div className="function-selector">
        <div className="function-selector--header">
          <span>
            {localSelectedItems.length > 0
              ? `${localSelectedItems.length} Selected`
              : 'Select functions below'
            }
          </span>
          <div className="btn btn-xs btn-primary" onClick={this.onApplyFunctions}>Apply</div>
        </div>
        <div className="function-selector--grid">
          {INFLUXQL_FUNCTIONS.map((f, i) => {
            return (
              <div
                key={i}
                className={classNames('function-selector--item', {
                  active: this.isSelected(f),
                })}
                onClick={_.wrap(f, this.onSelect)}
              >{f}</div>
            )
          })}
        </div>
      </div>
    )
  }
}

const {arrayOf, func, string} = PropTypes

FunctionSelector.propTypes = {
  onApply: func.isRequired,
  selectedItems: arrayOf(string.isRequired).isRequired,
}

export default FunctionSelector
