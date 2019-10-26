// @flow
import React, { type Node, Component } from 'react'
import {
  IoIosArrowDown as ArrowDownIcon,
  IoIosArrowUp as ArrowUpIcon,
} from 'react-icons/io'
import withOpen from 'hocs/withOpen'
import ContextMenu from 'components/ContextMenu'
import { Row, RowEvenly } from 'componentsStyled/Layout'
import { Styler, Wrapper } from './styled'

type Props = {|
  component: any,
  children: Node,
  data?: Object,
  style?: Object,
|}

/**
 * Used to handle a set of sub-links (similar to a context menu or a link with children links)
 * @param {Component} component- The component that is rendered and wrapped inside the conditional Context Menu
 * @param {React.Node} children - Most likely the name of the option to be displayed
 * @param {Object} data - Optional parameter to watch. If it changes, we close all previous open stateful links (if user logs in, for example) 
 */
class StatefulLink extends Component <any, any> {

  constructor(props: Props) {
    super(props)

    this.state = {
      myRef: React.createRef(),
    }

    // $Ignore
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(event: MouseEvent) {
    const { myRef } = this.state

    if (!myRef || !myRef.current) {
      return
    }

    if (!myRef.current.contains(event.target)) {
      this.props.close()
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.props.close()
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  render () {
    const C = this.props.component
    return (
      <Wrapper ref={this.state.myRef}>
        <Wrapper onClick={this.props.toggleOpen}>
          {this.props.rowEvenly
            ? <RowEvenly>{this.props.children} {this.props.isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</RowEvenly>
            : <Row>{this.props.children} {this.props.isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</Row>
          }
        </Wrapper>
        {this.props.isOpen &&
          <Styler style={this.props.style}>
            <ContextMenu>
              <C />
            </ContextMenu>
          </Styler>
        }
      </Wrapper>
    )
  }
}

export default withOpen(StatefulLink)
