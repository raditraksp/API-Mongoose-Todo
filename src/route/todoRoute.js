const express = require('express')
const router = new express.Router()
const Todo = require('../models/todoModel')
const User = require('../models/userModel')

// Create Todo
router.post('/todos/:userid', async (req, res) => {
   let owner = req.params.userid
   let description = req.body.description

   try {
      // todo = {_id : 14 , description: Memancing, completed : false, owner : 333}
      let todo = new Todo({ description, owner })
      // user = {_id: 333, username : rochafi, password: $2sjKil todos : [14]}
      let user = await User.findById(owner)
      user.todos.push(todo._id)
      
      await todo.save()
      await user.save()

      res.send(todo)
   } catch (err) {
      res.send(err)
   }

})

// Read Todo
router.get('/todos/:userid', async (req, res) => {
   // Menyimpan id user ke dalam userid
   let userid = req.params.userid

   try {
      // Mencari user berdasarkan id kemudian mencari semua todos yang ia punya
      let user = await User.find({_id : userid}).populate({
         path: 'todos'
      }).exec()

      // Mengirimkan hanya list todo saja sebagai responnya
      res.send(user[0].todos)
      
   } catch (err) {
      res.send(err)
   }
      
})

// Update Todo Completed
router.patch('/todo/:todoid', async (req, res) => {
   // Property yang dikirim
   let keys = Object.keys(req.body)
   // Filtering untuk property yang dikirim apakah ada yang undefined atau string kosong
   let finalKeys = keys.filter(val => {
      if(req.body[val] === undefined || req.body[val] === ""){
         return false
      } else {
         return true
      }
   })

   try {
      let todo = await Todo.findById(req.params.todoid)
      // Update nilai todo sesuai hasil filtering
      finalKeys.forEach(val => todo[val] = req.body[val])
      // save
      await todo.save()

      res.send('Update Berhasil')
   } catch (err) {
      res.send(err)
   }

})

// Delete todo

router.delete('/todo/:todoid', async (req, res) => {

   try {
      // Menghapus todo yang sudah dikerjakan
      let todo = await Todo.findByIdAndDelete(req.params.todoid)
      // Menghapis id todo yang sudah dikerjakan dari array 'todos' pada user
      let user = await User.findById(todo.owner)
      user.todos = user.todos.filter(todoId => {
         return todo._id !== todoId
      })

      // Menyimpan hasil perubahan user
      await user.save()

      res.send('Delete Berhasil')
   } catch (err) {
      res.send(err)
   }
})












module.exports = router