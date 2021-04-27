const express = require("express");

const Joi = require("joi");

const app = express();


app.set('view-engine' , 'ejs')

app.use(express.urlencoded( { extended: false}))

app.use(express.json());


const courses=[];


app.get('/web/courses/create/' ,(req , res) => {

	res.render("course.ejs");
}); 

app.get('/api/courses'  , (req , res) => {

	res.send(courses);
});

app.get('/api/courses/:id'  , (req , res) => {
   
	const course=courses.find(c => c.id === parseInt(req.params.id)) ;
	if (!course) return res.status(404).send(" The Course with the given ID was not found") ;
	res.send(course) ;
}); 


app.post('/web/courses/create'  , (req , res) => {
    

    
	   const course={

		id: courses.length+1  ,

		name: req.body.name ,

		code: req.body.code ,

		description: req.body.des

	    } ;

	    courses.push(course) ;
        
}); 

app.post('/api/courses/'   , (req , res) => {
    
       const {error}=validateCourse(req.body) ;
       
       if (error) return res.status(400).send(error.details[0].message)  ;
         
	   const course={

		id: courses.length+1  ,

		name: req.body.name ,

		code: req.body.code ,

		description: req.body.description

	    };



	    courses.push(course) ;
	    res.send(course) ;   
});

app.put('/api/courses/:id/'   , (req , res) => {

    const course=courses.find(c => c.id === parseInt(req.params.id)) ;
	if (!course) return  res.status(404).send(" The Course with the given ID was not found") ;

	const {error}=validateCourse(req.body) ;
       
    if (error) return res.status(400).send(error.details[0].message) ; 
       

    course.name = req.body.name ;

    course.code = req.body.code ;

    course.description = req.body.description ;

    res.send(course) ;


    });

app.delete('/api/courses/:id/'   , (req , res) => {

  const course=courses.find(c => c.id === parseInt(req.params.id)) ;
  if (!course)  return res.status(404).send(" The Course with the given ID was not found") ; 
   
   const index = courses.indexOf(course) ;
   courses.splice(index , 1) ;

   res.send(course) ;

});


function validateCourse(course){


	const schema= {

       name : Joi.string().min(5).required() ,

       code : Joi.string().regex(/^[a-zA-Z]{3}[0-9]{3}$/).required() ,

       description : Joi.string().max(200).optional()

    };


     return Joi.validate(course , schema) ;

}


app.listen("3000", () => {

  console.log("Server started on port 3000");

});

