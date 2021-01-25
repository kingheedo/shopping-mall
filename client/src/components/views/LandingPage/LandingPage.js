import React,{useEffect, useState} from 'react';
import axios from 'axios';
import {Icon, Col, Card, Row, Carousel} from 'antd';
import {RocketOutlined} from '@ant-design/icons'
import Meta from 'antd/lib/card/Meta'
import ImageSilder from '../../utils/ImageSilder'

function LandingPage() {
    const [products, setProducts] = useState([])
    const [skip, setSkip] = useState(0)
    const [limit, setLimit] = useState(8)


    useEffect(() => {

        let body = {
            skip:skip,
            limit:limit,

        }
        axios.post('/api/product/products', body)
        .then(response =>{
            if (response.data.success){
                console.log(response.data)
                
                setProducts(response.data.productsInfo)
            }else{
                alert("상품들을 가져오는데 실패 했습니다.")
            }
        })


    }, [])

    const loadMoreHandler = () => {

    }


    const renderCards = products.map((product,index) => {

        console.log('product', product)

        return <Col lg={6} md={8} xs={24} key={index}>
        {/* <img style={{width: '100%', maxHeight:'150px'}} src={`http://localhost:5000/${product.images[0]}`}/> */}
        <Card 

        cover ={<ImageSilder images = {product.images}/>}>
                
            <Meta
                title={product.title}
                description={`$${product.price}`}
            />
        </Card>
        </Col>
    })

    return (
        <div style={{width: '75%', margin: '3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h2>Let's Travel Anywhere<RocketOutlined /> </h2>
            </div>
            {/* Filter */}

            {/* Search */}
            
            {/* Cards */}

            
            <Row gutter= {[16,16]}>
            {renderCards}

            </Row>
            

            <div style={{display: 'flex', justifyContent:'center'}}>
                <button onClick={loadMoreHandler}>더보기</button>
            </div>
            
        </div>
    )
}

export default LandingPage
