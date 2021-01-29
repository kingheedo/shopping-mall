import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';
function ProductImage(props) {
    const [Images, setImages] = useState([])
    useEffect(() => {
        if(props.details.images && props.details.images.length > 0){
            let images = []
            props.details.images.map(item =>{
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImages(images)
        }
    }, [props.details])
   
    return (
        <div>
            <ImageGallery items={Images}/>
        </div>
    )
}

export default ProductImage
