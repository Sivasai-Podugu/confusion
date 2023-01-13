import React, { Component } from 'react'
import { Card, CardBody, CardImg, CardText, CardTitle, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, Errors, LocalForm } from 'react-redux-form';
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Nav, NavItem, FormGroup } from 'reactstrap'
import LoadingComponent from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import {FadeTransform, Stagger,Fade } from 'react-animation-components'


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <=len) ;
const minLength = (len)=> (val) => (val) && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
         isModalOpen: false
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.toggleModal = this.toggleModal.bind(this);
    }
    handleSubmit(values) {
      this.toggleModal();
        // console.log("Current State is: " + JSON.stringify(values));
        // alert("Current state is: " + JSON.stringify(values));
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        console.log(values.comment, values.author,this.props.dishId, values.rating);
    }

    toggleModal(){
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }
    
  render() {
    return (
        <>
            <Nav className='ml-auto' navbar>
                <NavItem>
                    <Button outline onClick={this.toggleModal}>
                        <span className='fa fa-pencil fa-lg ' > Submit Comment </span>
                    </Button>

                </NavItem>
                
            </Nav>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                   Submit Comment
                </ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values)=>this.handleSubmit(values)}>
                        <FormGroup>
                            <Label htmlFor="rating">Rating</Label>
                           
                                <Control.select model='.rating' name='rating' className='form-control'>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                            
                        </FormGroup>

                        <FormGroup >
                            <Label htmlFor="author" >Your Name</Label>
                            
                                <Control.text model='.author' id="author" name='author' 
                                    placeholder='Your Name' 
                                    className='form-control'
                                    validators={{
                                        required, minLength:minLength(3), maxLength:maxLength(15) 
                                    }} 
                                    />
                                    <Errors 
                                    className='text-danger'
                                    model='.author'
                                    show="touched"
                                    messages={
                                        {
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }
                                    }
                                    
                                    />
                                
                            
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="comment" >Comment</Label>
                           
                                <Control.textarea model='.comment' id="comment" name='comment' rows="6" className='form-control'/>
                            
                        </FormGroup>
                        <FormGroup>
                            <Col md={{ size: 10, offset: 2 }}>
                                <Button type='submit' color='primary'>
                                    Submit
                                </Button>
                            </Col>
                        </FormGroup>
                    </LocalForm>
                    

                </ModalBody>

            </Modal>

        </>
     


    )
  }
}

  function RenderDish({dish}){
      if(dish!=null){
        return(
          <FadeTransform in
                transformProps ={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }} >
            <Card>
              <CardImg top src={baseUrl + dish.image} alt={dish.name} />
              <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
              </CardBody>
            </Card>
          </FadeTransform>
        )
      }
      else{
        return(
          <div></div>
        )
      }
  }  

  function RenderComments({comments, postComment, dishId}){
      if(comments == null){
          return(
              <div>
              </div>
          )
      }
      const cmts = comments.map((cmt)=>{
          return(
            <Fade in>
              <li key={cmt.id}>
                  <p>{cmt.comment}</p>
                  <p>-- {cmt.author} ,{new Intl.DateTimeFormat('en-US' , { year : 'numeric' , month : 'short' , day : '2-digit'}).format(new Date(Date.parse(cmt.date)))} </p>
              </li>
              
            </Fade>
              
          )
      })
      return (
        <ul className='list-unstyled'>
            <h4>Comments</h4>
            <Stagger in>
              {cmts}
              <CommentForm dishId = {dishId} postComment={postComment} />
            </Stagger>
        </ul> 
      )
  }
  
const DishDetail =(props) => {
  if(props.isLoading){
    return(
      <div className='conatiner'>
        <div className='row'>
          <LoadingComponent />
        </div>
      </div>
    );
  }

  else if(props.errMess){
    return(
      <div className='conatiner'>
        <div className='row'>
          <h4>{props.errMess}</h4>
        </div>
      </div>
    )
  }


  else if(props.dish != null){
      return(
        <div className='container'>

    <div className='row'>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to='/menu'>Menu</Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
      </Breadcrumb>
      <div className='col-12'>
        <h3>{props.dish.name}</h3>
        <hr />
      </div>
    </div>
          <div className='row'>
              <div className='col-12 col-md-5 m-1'>
                  <RenderDish dish={props.dish} />
              </div>
              <div className='col-12 col-md-5 m-1'>
                  
                    {/* {console.log(typeof(props.comments))} */}
                      <RenderComments comments={props.comments} 
                        postComment = {props.postComment}
                        dishId = {props.dish.id}
                        />
                  
              </div>
          </div>
        </div>
      )
  }
  else{
      return (
          <div>  
          </div>
        )

  }
  
}

export default DishDetail
