<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert title="添加商品信息" type="warning" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addFormRules"  ref='addFormRef' label-width="100px" label-position="top">
         <el-tabs :tab-position="'left'" :before-leave="beforeTabLeave" v-model="activeIndex" @tab-click="tabclicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
             <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
             <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
             <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
               <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateprops" @change="handleChange" prop="goods_cat"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
             <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key='item.attr_id'>
               <!-- 复选框组 -->
               <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
             </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
    data(){
      return {
        //动态参数列表数据
        manyTableData:[],
        //选择框的
        cateprops: {
          label: 'cat_name',
          value: 'cat_id',
          children:'children',
          expandTrigger: 'hover'
        },
        //商品分类列表
        cateList: [],
        activeIndex: '0',
        //添加商品的表单数据对象
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          //商品所属的分类数组
          goods_cat: []
        },
        //验证规则
        addFormRules: {
          goods_name: [
            { required: true, message: '请输入商品名称',tirrger: 'blur'}
          ],
          goods_price: [
            { required: true,message: '请输入商品价格',tirrger: 'blur'}
          ],
          goods_weight: [
            { required: true,message:'请输入商品重量',tirrger:'blur'}
          ],
          goods_number : [
            { required: true,message: '请输入商品数量',tirrger:'blur'}
          ],
          goods_cat: [
            { required: true,message:'请选择商品分类',tirrger: 'blur'}
          ]
        },
      }
    },
    created(){
      this.getCateList()
    },
    methods: {
      async tabclicked(){
        // console.log(this.activeIndex);
        if(this.activeIndex === '1' ) {
          //证明访问的是动态参数面板
          // console.log(1);
          const { data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params: {sel:'many'}})
          if(res.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
          // console.log(res.data);
          // this.$message.success('获取成功')
          res.data.forEach(item=> {
            item.attr_vals = item.attr_vals.length === 0?[]:item.attr_vals.split(',')
          })
          //  console.log(res.data); 
          this.manyTableData = res.data
        }
      },
      beforeTabLeave(activeName,oldActiveName){
        // console.log('即将离开的标签页名字是' + oldActiveName);
        // console.log('即将进入的标签页名字是' + activeName);
        if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },
      //忌廉选择器选中项变化会触发这个函数
      handleChange(){
        // console.log(this.addForm.goods_cat);
        if(this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      //获取所有商品分类数据
      async getCateList(){
        const {data: res} = await this.$http.get('categories')
        if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
        this.cateList = res.data
        console.log(this.cateList);
      },
    },
    computed: {
      cateId(){
        if(this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
        return null
      }
    }

}
</script>
<style lang='less'scoped>
.el-checkbox {
  margin: 0 5px 0 0!important;
}
</style>