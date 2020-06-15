import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { addItem } from '../../actions/cart';

const ProductItem =  ({product, addItem, isAuthenticated}) => {
    const { image, name, marketPrice, hbPrice } = product;
    return (
        <div style={{display: 'inline-block'}}>
            <img 
            src= {image}
            alt="new"
            style={{width: '200px', height: '200px'}}
            />
            <h5>{name}</h5>
            <h6 style={{textDecoration: 'line-through'}}>Rs.{marketPrice}/kg</h6>
            <h6>Rs.{hbPrice}/kg</h6>
            {isAuthenticated ? <button className="btn btn-dark" onClick={() => addItem(product)}><i className="fa fa-plus"></i> Add to cart</button> : null}
        </div>
)};

ProductItem.protoType = {
    addItem: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {addItem})(ProductItem);