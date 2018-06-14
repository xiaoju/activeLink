import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import {
  // applyDiscount,
  total,
  applyDiscount
  // applicablePriceArray,
  // applicablePriceObject,
  // itemsListExport
  // adjustedItemPrice
} from '../selectors';

class Payments extends Component {
  componentDidUpdate() {
    console.log('payments: component did update');
    // console.log('this.props.data: ', this.props.data);
    // this.props.data &&
    //   console.log('itemsListExport: ', this.props.itemsListExport);
    // this.props.data &&
    //   console.log('applicablePriceArray: ', this.props.applicablePriceArray);
    this.props.data &&
      console.log(
        // 'applicablePriceObject: ',
        // this.props.applicablePriceObject,
        'applyDiscount: ',
        this.props.applyDiscount
      );
    // const urlPostId = this.props.match.params.id

    // this.props.fetchCategories()
    //   .then(()=>this.props.fetchAllPosts())
    //   .then(()=>(
    //     this.props.posts.visible.includes(urlPostId) &&
    //     this.props.showMore(urlPostId)
    //   ))
  }

  render() {
    return (
      <StripeCheckout
        name="English Link"
        description="2018-2019 registrations"
        amount={
          this.props.total / 100
          // && console.log('applicablePriceArraw: ', applicablePriceArraw
        }
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <a className="waves-effect waves-light btn-large orange lighten-1">
          <i className="material-icons left">shopping_cart</i>
          {this.props.total / 100} &euro;
        </a>
      </StripeCheckout>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data,
    checked: state.checked,
    // applyDiscount: applyDiscount(state),
    total: total(state),
    // applicablePriceArray: applicablePriceArray(state),
    // applicablePriceObject: applicablePriceObject(state),
    applyDiscount: applyDiscount(state)
    // itemsListExport: itemsListExport(state)
    // adjustedItemPrice: adjustedItemPrice(state)
  };
}

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(Payments);
