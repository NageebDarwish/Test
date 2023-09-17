import { useEffect, useRef, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import { Axios } from "../../Api/axios";
import { CAT, Cat, Pro } from "../../Api/Api";
import Loading from "../../Components/Loading";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [form, setForm] = useState({
    category: "Select Category",
    title: "",
    description: "",
    price: "",
    discount: "",
    About: "",
  });
  const dummyForm = {
    category: null,
    title: "dummy",
    description: "dummy",
    price: 222,
    discount: 0,
    About: "About",
  };
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sent, SetSent] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const nav = useNavigate();

  // Ref
  const focus = useRef("");
  const openImage = useRef(null);

  // Handle Focus
  useEffect(() => {
    focus.current.focus();
  }, []);

  function handleOpenImage() {
    openImage.current.click();
  }

  // Get ALl Categories
  useEffect(() => {
    Axios.get(`/${CAT}`)
      .then((data) => setCategories(data.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle Edit
  async function HandleEdit(e) {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await Axios.post(`${Pro}/edit/${id}`, form);
      nav("/dashboard/products");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  // Handle Submit Form
  async function HandleSubmitForm() {
    try {
      const res = await Axios.post(`${Pro}/add`, dummyForm);
      setId(res.data.id);
    } catch (err) {
      console.log(err);
    }
  }

  // HandleChange
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    SetSent(1);
    if (sent !== 1) {
      HandleSubmitForm();
    }
  }

  // Handle Image Changes
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
            const percent = Math.floor((loaded * 100) / total);

            if (percent % 20 === 0) {
              setImages((prev) =>
                prev.map((img) => {
                  if (img.file === imagesAsFiles[i]) {
                    return {
                      ...img,
                      loaded: percent,
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

  // Mapping
  const categoriesShow = categories.map((item, key) => (
    <option key={key} value={item.id}>
      {item.title}
    </option>
  ));

  const imagesShow = images.map((img, key) => (
    <div className="border p-2 w-100">
      <div className="d-flex align-items-center justify-content-start gap-2 ">
        <img src={URL.createObjectURL(img.file)} width="80px"></img>
        <div>
          <p className="mb-1">{img.name}</p>
          <p>
            {img.file.size / 1024 < 900
              ? (img.file.size / 1024).toFixed(2) + "KB"
              : (img.file.size / (1024 * 1024)).toFixed(2) + "MB"}
          </p>
        </div>
      </div>
      <div className="custom-progress mt-3">
        <span
          percent={`${img.loaded === 0 ? uploading : "100"}%`}
          style={{ width: `${img.loaded === 0 ? uploading : "100"}%` }}
          className="inner-progress"
        ></span>
      </div>
    </div>
  ));

  return (
    <>
      {loading && <Loading />}
      <Form className="bg-white w-100 mx-2 p-3" onSubmit={HandleEdit}>
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Select
            ref={focus}
            value={form.category}
            onChange={handleChange}
            name="category"
            placeholder="Title..."
          >
            <option disabled>Select Category</option>
            {categoriesShow}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={form.title}
            required
            onChange={handleChange}
            name="title"
            type="text"
            placeholder="Title..."
            disabled={!sent}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={form.description}
            required
            onChange={handleChange}
            name="description"
            type="text"
            placeholder="Description..."
            disabled={!sent}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            value={form.price}
            required
            onChange={handleChange}
            name="price"
            type="text"
            placeholder="Price..."
            disabled={!sent}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="discount">
          <Form.Label>Discount</Form.Label>
          <Form.Control
            value={form.discount}
            required
            onChange={handleChange}
            name="discount"
            type="text"
            placeholder="Discount..."
            disabled={!sent}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="About">
          <Form.Label>About</Form.Label>
          <Form.Control
            value={form.About}
            required
            onChange={handleChange}
            name="About"
            type="text"
            placeholder="About..."
            disabled={!sent}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="images">
          <Form.Label>Images</Form.Label>
          <Form.Control
            ref={openImage}
            hidden
            multiple
            onChange={HandleImagesChange}
            type="file"
            disabled={!sent}
          />
        </Form.Group>
        <div
          onClick={handleOpenImage}
          className="d-flex align-items-center justify-content-center gap-2 py-3 rounded mb-2 w-100 flex-column"
          style={{
            border: !sent ? "2px dashed gray" : " 2px dashed #0086fe",
            cursor: sent && "pointer",
          }}
        >
          <img
            src={require("../../Assets/images/upload.png")}
            alt="Upload Here"
            width="100px"
            style={{ filter: !sent && "grayscale(1)" }}
          />
          <p
            className="fw-bold mb-0"
            style={{ color: !sent ? "gray" : "#0086fe" }}
          >
            Upload Images
          </p>
        </div>
        <div className="d-flex align-items-start flex-column gap-2">
          {imagesShow}
        </div>
        <button className="btn btn-primary">Save</button>
      </Form>
    </>
  );
}
