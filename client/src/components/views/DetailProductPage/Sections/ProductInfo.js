import React from 'react'
import {Button, Descriptions} from 'antd'
import {useDispatch} from 'react-redux'
import {addToCart} from '../../../../_actions/user_actions'
function ProductInfo(props) {
    const dispatch = useDispatch();

    const clickHandler = () =>{

        //필요한 정보를 Cart 필드에다가 넣어준다.
        dispatch(addToCart(props.details._id))

    }

    return (
        <div>
        <Descriptions title="Product Info">
                <Descriptions.Item label="Price">{props.details.price}</Descriptions.Item>
                <Descriptions.Item label="Sold">{props.details.sold}</Descriptions.Item>
                <Descriptions.Item label="View">{props.details.views}</Descriptions.Item>
                <Descriptions.Item label="Description">{props.details.description}</Descriptions.Item>
            </Descriptions>

            <br/>
            <br/>
            <br/>
            <div style={{display:'flex',justifyContent : 'center'}}>
                <Button size="large" shape= "round" type="danger" onClick={clickHandler}>
                    Add to Cart
                </Button>
            </div>

        </div>
    )
}

export default ProductInfo
