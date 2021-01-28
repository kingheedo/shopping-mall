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
    const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
];
    return (
        <div>
            <ImageGallery items={Images}/>
        </div>
    )
}

export default ProductImage
