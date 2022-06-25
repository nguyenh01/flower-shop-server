const multer = require("multer");
// const upload = multer({ dest: '../public/assets/images/products/uploads/' })
const store = require("../middlewares/multer");
const validator = require("../middlewares/validator");
const ProductService = require("../services/product.service").getInstance();

module.exports = (router) => {
  router.post("/create",
    // validator({
    //   cate_id: {
    //     type: 'string',
    //     required: true
    //   },
    //   name: {
    //       type: 'string',
    //       required: true
    //   },
    //   price: {
    //       type: 'string',
    //       required: true
    //   },
    // }),
    store.array("images", 12),
    // upload.array('files')
    async (req, res, next) => {
      try {
        const result = await ProductService.create(req.body, req.files);
        return res.status(200).json({
          data: result,
        });
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  ),
  router.get("/", async (req, res, next) => {
    try {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const cate_id = req.query.cate_id?.split(",");
      const mate_id = req.query.mate_id?.split(",");
      const order_by = req.query.order_by;
      const is_instock = req.query.is_instock?.split(",")
      const name = req.query.name;
      const result = await ProductService.get({
        order_by,
        is_instock,
        mate_id,
        cate_id,
        name,
        page: page,
        size: size,
      });
      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }),
  router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await ProductService.getById(id);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }),
  router.put("/", store.array("images", 12), async (req, res, next) => {
    try {
      const result = await ProductService.updateProduct(req.body, req.files);
      if (result) {
        return res.status(200).json({msg: "Cập nhật thành công"});
      }
      return res.status(400).json({msg: "Lỗi người dùng"})
    } catch (error) {
      console.log(error);
      next(error);
    }
  })

  // router.put("/", async (req, res, next) => {
  //   try {
  //     console.log('helllllo')
  //     return res.status(200).json();
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }),
};
