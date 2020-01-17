import {Link} from 'gatsby'
import React from 'react'
import Icon from './icon'
import {cn} from '../lib/helpers'

const Subheaditem = props => (
    <article class="tc fl w-50 white w-33-ns ">
    <a href="#0" class="ph2 ph0-ns pb3 link db">
      <img src={props.icon} class="mw3" />
      <h3 class="f5 center  f4-l f7 mb0 white-90">{props.title}</h3>
    </a>
  </article>
);
export default Subheaditem