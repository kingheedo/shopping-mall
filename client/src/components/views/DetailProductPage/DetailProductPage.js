import React, { useEffect } from 'react'
import axios from 'axios'
function DetailProductPage(props) {

    const productId = props.match.params.productId

    useEffect(() => {

        axios.get(`/api/product/product_by_id?id=${productId}&type=single`)
        .then(response => {
            if(response.data.success) {
                console.log('response.data',response.data)
            }else{
                alert('상세 정보 가져오기를 실패 했습니다.')
            }
        })
    }, [])
    return (
        <div>
            DetailProductPage
        </div>
    )
}

export default DetailProductPage
