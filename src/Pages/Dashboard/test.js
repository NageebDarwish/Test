async function HandleImagesChange(e) {
  setImages((prev) =>
    [...prev, ...e.target.files].map((file) => {
      if (!prev.includes(file)) {
        return { file, loaded: 0 };
      }
      return file;
    })
  );

  const imagesAsFiles = e.target.files;
  const data = new FormData();
  for (let i = 0; i < imagesAsFiles.length; i++) {
    data.append("image", imagesAsFiles[i]);
    data.append("product_id", id);
    try {
      await Axios.post("/product-img/add", data, {
        onUploadProgress: (ProgressEvent) => {
          const loaded = ProgressEvent.loaded;
          const total = ProgressEvent.total;
          const persent = Math.floor((loaded * 100) / total);

          if (persent % 10 === 0) {
            setUploading(persent);
          }

          if (persent === 100) {
            setImages((prev) =>
              prev.map((img) => {
                if (img.file === imagesAsFiles[i]) {
                  return {
                    ...img,
                    loaded: persent,
                  };
                }
                return img;
              })
            );
          }
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
