import React from 'react'
import {Button, Descriptions} from 'antd'
function ProductInfo(props) {

    const clickHandler = () =>{
        
    }

    return (
        <div>
            <Descriptions title="Product Info" bordered>
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
