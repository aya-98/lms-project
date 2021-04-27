const express = require("express");

const Joi = require("joi");

const app = express();


app.set('view-engine' , 'ejs')

app.use(express.urlencoded( { extended: false}))

app.use(express.json());


const students=[];


app.get('/web/students/create/' ,(req , res) => {

	res.render("student.ejs");
});

app.get('/api/students'  , (req , res) => {

	res.send(students);
});

app.get('/api/students/:id'  , (req , res) => {
   
	const student=students.find(c => c.id === parseInt(req.params.id)) ;
	if (!student) return  res.status(404).send(" The Course with the given ID was not found") ;
	res.send(student) ;
}); 


app.post('/web/students/create'  , (req , res) => {
       
       const {error}=validateStudent(req.body) ;
       
       if (error) return  res.status(400).send(error.details[0].message) ;

      
	   const student={

		id: students.length+1  ,

		name: req.body.name ,

		code: req.body.code 

		

	    } ;

	    students.push(student) ;

});

app.post('/api/students'   , (req , res) => {
    
       const {error}=validateStudent(req.body) ;
       
       if (error) return  res.status(400).send(error.details[0].message) ;
        
        
	   const student={

		id: students.length+1  ,

		name: req.body.name ,

		code: req.body.code 

	    };

	    students.push(student) ;
	    res.send(student) ;   
});

app.put('/api/students/:id'   , (req , res) => {

    const student=students.find(c => c.id === parseInt(req.params.id)) ;
	if (!student) return res.status(404).send(" The Course with the given ID was not found") ;

	const {error}=validateStudent(req.body) ;
       
       if (error) return res.status(400).send(error.details[0].message) ;

        student.name = req.body.name ;

        student.code = req.body.code ;

        res.send(student) ;


    });

app.delete('/api/students/:id'   , (req , res) => {

  const student=students.find(c => c.id === parseInt(req.params.id)) ;
  if (!student)  return res.status(404).send(" The Course with the given ID was not found") ; 
   
   const index = students.indexOf(student) ;
   students.splice(index , 1) ;

   res.send(student) ;

});

function validateStudent(student){


	const schema= {

       name : Joi.string().regex(/^[a-zA-Z'’–—-]+$/).required() ,

       code : Joi.string().regex(/^.{7}$/).required ()

       

    };


     return Joi.validate(student , schema) ;

}


app.listen("3000", () => {

  console.log("Server started on port 3000");

});
