import React, { useState } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';

const CustomImageUpload = ({ productId, option }) => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
  
    // // Comprimir cada imagen antes de agregarla al estado
    // const compressedImages = await Promise.all(files.map(async (file) => {
    //   const options = {
    //     maxSizeMB: 0.1, // Tamaño máximo de la imagen comprimida en megabytes
    //     maxWidthOrHeight: 1024 // Ancho o alto máximo de la imagen comprimida en píxeles
    //   };
    //   const compressedFile = await imageCompression(file, options);
    //   return compressedFile;
    // }));
  
    setImages((prevImages) => [...prevImages, ...files]);
  
    // Crear vistas previas para las nuevas imágenes
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  // const uploadImages = async () => {
  //   const storageRef = '';//firebase.storage().ref();
  //   const imageUrls = [];

  //   // Subir cada imagen y obtener su URL
  //   for (const image of images) {
  //     const imageName = `${productId}_${image.name}`;
  //     const imageRef = storageRef.child(`product_images/${imageName}`);
  //     const uploadTask = imageRef.put(image);

  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         // Actualizar el progreso de carga
  //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         setUploadProgress(progress);
  //       },
  //       (error) => {
  //         console.error('Error al subir la imagen:', error);
  //       },
  //       () => {
  //         // Cuando se completa la carga, obtener la URL de la imagen y guardarla
  //         uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
  //           imageUrls.push(downloadURL);

  //           // Si todas las imágenes se han subido, guardar las URL en la base de datos
  //           if (imageUrls.length === images.length) {
  //             // Guardar las URLs en la base de datos o hacer lo que sea necesario
  //             console.log('URLs de imágenes subidas:', imageUrls);
  //             // Aquí podrías guardar las URLs en la base de datos del producto
  //           }
  //         });
  //       }
  //     );
  //   }

  //   setImages([]); // Clear image states after successful uploads
  //   setImagePreviews([]);
  //   setUploadProgress(0);
  // };

  const handleDeleteImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    // Eliminar la vista previa de la imagen eliminada
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  return (
    <Row className={`${option === 'C' && 'mb-2'}`}>
      <Col md={{ span: 2, offset: 2 }}>
        {option !== 'C' ?
          <Form.Label htmlFor="file-upload" className="pointer">Imágenes</Form.Label>
          :
          <div> {/* Para evitar que el label no tenga una referencia */}
            Imágenes
          </div>
        }
      </Col>
      <Col md={6}>
          {option !== 'C' && 
            <Form.Control id="file-upload" type="file" multiple accept="image/*" onChange={handleImageChange} className="bg-obscure text-white custom-border" />
          }
          <Row xs={1} md={2} lg={3} className="g-2 mt-2">
            {imagePreviews.map((preview, index) => (
              <Col key={index}>
                <Card className="custom-border">
                <div style={{ position: 'relative' }}>
                  <Card.Img src={preview} alt={"Imagen preview "+index} />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteImage(index)}
                    style={{ position: 'absolute', top: '5px', right: '5px', zIndex: 1 }}
                    className="bold"
                  >
                    <i className="fa-solid fa-xmark fa-lg"></i>
                  </Button>
                </div>
                </Card>
              </Col>
            ))}
          </Row>
          {uploadProgress > 0 && <p>Progreso de carga: {uploadProgress}%</p>}
      </Col>
    </Row>
  );
};

export default CustomImageUpload;