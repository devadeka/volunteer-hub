import React, { useReducer } from "react";
import Button from "../../styles/button"
import styled from "styled-components"

const StyledWrapper = styled.div`
	margin: 3rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
`
const StyledInput = styled.input`
	margin: .5rem;
	border-radius: .25rem;
	border: .1rem solid ${props => props.error ? 'rgba(255, 0, 0, .4)' : 'lightgrey' };
	width: 50%;
	font-size: 1rem;
	padding: .5rem;
	background: ${props => props.error ? 'rgba(255, 0, 0, .4)' : '' };
`

const StyledInputTextArea = styled.textarea`
	margin: .5rem;
	border-radius: .25rem;
	border: .1rem solid ${props => props.error ? 'rgba(255, 0, 0, .4)' : 'lightgrey' };
	width: 100%;
	font-size: 1rem;
	padding: .5rem;
	background: ${props => props.error ? 'rgba(255, 0, 0, .4)' : '' };
`

const StyledFieldSet = styled.fieldset`
	border: none;
`

const StyledSpan = styled.span`
	display: flex;
	justify-content: center;
	color: ${props => props.error ? 'rgba(255, 0, 0)' : '' };
`

const StyledDiv = styled.div`
	margin-left: 1rem;
	width: 50%;
	font-size: .9rem;
	color: rgba(255, 0, 0);
`

const formReducer = (state, action) => {
	switch (action.type) {
		case 'reset': {
			return {
				...initialState,
				formSubmitted: true
			}
		}
		case 'field': {
			return {
				...state,
				[action.field]: {
					...state[action.field],
					'value' : action.value,
					'touched': true,
				},
			}
		}
		case 'error': {
			return {
				...state,
				[action.field]: {
					...state[action.field],
					'hasError' : true,
					'error' : action.error,
					'touched': true
				}			}
		}
		case 'clear-error': {
			return {
				...state,
				[action.field]: {
					...state[action.field],
					'hasError' : false,
					'error' : ''
				},
			}
		}
		case 'submission-error': {
			return {
				...state,
				'submissionError': action.error
			}
		}
	}
}

const initialState = {
	name: {
		value: '',
		hasError: false,
		error: '',
		touched: false
	},
	email: {
		value: '',
		hasError: false,
		error: '',
		touched: false
	},
	request: {
		value: '',
		hasError: false,
		error: '',
		touched: false
	},
	formSubmitted: false,
	submissionError: ''
}

const GATEWAY_URL = process.env.GATSBY_SUBMISSION_URL

const Form = () => {
	const [state, dispatch] = useReducer(formReducer, initialState);

	const handleSubmit = async event => {
	event.preventDefault();

	let formValid = true;
	const checkForm = {
		'name': state.name.value,
		'email': state.email.value,
		'request': state.request.value
	}

	Object.entries(checkForm).map(([key,val]) => {
		const { hasError, error } = validateInput(key, val);
		if(hasError){
			formValid = false

			dispatch({
				type: 'error',
				field: key,
				error: error
			});
		}
	})

	 try {
		if(formValid){
			await fetch(GATEWAY_URL, {
				method: "POST",
				mode: "no-cors",
				cache: "no-cache",
				body: JSON.stringify(checkForm),
				headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*"
				}
			})
			dispatch({type: 'reset'})
		}
	  } catch (error) {
			dispatch({type: 'submission-error', error : error})
	  }
   }

   	const handleChange = event => {
		const { hasError, error } = validateInput(event.target.name, event.target.value)
		let formError = false;

		for (const key in state) {
		  const item = state[key]
		  // Check if any other fields have an error
		  if (key !== event.target.name && hasError) {
			  formError = true;
		  }
		}

		if(hasError){
			dispatch({
				type: 'error',
				field: event.target.name,
				error: error
			});
		} else {
			dispatch({
				type: 'clear-error',
				field: event.target.name,
				formValid: formError
			});
		}

		dispatch({
			type: 'field',
			field: event.target.name,
			value: event.target.value,
		});
  	}

	const validateInput = (name, value) => {
		let hasError = false,
		error = ""
		switch (name) {
		  case "name":
			if (!value || value.length <= 0) {
			  hasError = true
			  error = "Please provide your name"
			}
			break
		  case "email":
				if (!value || value.length <= 0) {
				  hasError = true
				  error = "Please provide your email"
				}
				break		  
		  case "request":
				if (!value || value.length <= 0) {
				  hasError = true
				  error = "Please provide the details of what you would like help with"
				}
				break
		  default:
			break
		}
		return { hasError, error }
	}
  
	return(
	  <StyledWrapper>
		<form onSubmit={handleSubmit}>
		  <div>
		  	{state.submissionError.length > 0 && (<p>{state.submissionError}</p>)}
			{state.formSubmitted && <p>Your request was successfully submitted. We will be in touch shortly!</p>}
		  </div>
		  <StyledFieldSet>
			<StyledSpan>
				<StyledInput name="name" label="Name" onChange={handleChange} error={state.name.hasError} placeholder="Name" value={state.name.value}/>
				<StyledInput name="email" label="Email" onChange={handleChange} error={state.email.hasError} placeholder="Email" value={state.email.value}/>
			</StyledSpan>
			<StyledSpan>
				<StyledDiv>
					{state.name.touched && state.name.hasError && (
						state.name.error)
					}
				</StyledDiv>
				<StyledDiv>
					{state.email.touched && state.email.hasError && (
						state.email.error)
					}
				</StyledDiv>
			</StyledSpan>
			<StyledSpan>
			  	<StyledInputTextArea name="request" label="Details" onChange={handleChange} error={state.request.hasError} placeholder="Details" value={state.request.value} rows="10"/>
			</StyledSpan>
			<StyledSpan error={true}>
				{state.request.touched && state.request.hasError && (
					state.request.error)
				}
			</StyledSpan>
		  </StyledFieldSet>
		  <StyledSpan>
		  	<Button textAlign="center" type="submit">Submit</Button>
		  </StyledSpan>
		</form>
	  </StyledWrapper>
	)
  }
  
  export default Form