/* eslint-disable react/no-set-state */
import React, { Component } from 'react';
import NewsletterAfterSignUp from './after-sign-up/';
import NewsletterBeforeSignUp from './before-sign-up/';

export function isValidEmail(email) {
  const regex = /.+@.+\..+/;
  return regex.test(email);
}

const fetchFunction = ({ url, body, method }) => (
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body,
  })
);

class NewsLetter extends Component {
  constructor() {
    super();
    this.state = {
      newsletterSubmitted: false,
      email_address: '',
      errorMessage: '',
      updatedFormSubmitted: false,
    };
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(data, method, submitFormFunction = fetchFunction) {
    let inBeforeSignUp = true;
    if (this.state.email_address) {
      inBeforeSignUp = false;
    }
    const object = Object.assign({}, data);
    // If we are on the second part of the form, this gets the email saved in our state
    if (!data || !data.email_address) {
      object.email_address = this.state.email_address;
    }
    // If we are in the second part of the form
    // and the user does not provide a full name, we return an error
    if (!inBeforeSignUp && !data.name) {
      return this.setState({
        newsletterSubmitted: true,
        email_address: this.state.email_address,
        errorMessage: 'Please tell us who you are',
      });
    }
    // !this.state.email_address is a check that we are in before sign up
    if (inBeforeSignUp && data.email_address === '') {
      return this.setState({
        errorMessage: 'Please enter an email address',
      });
    }
    // !this.state.email_address is a check that we are in before sign up
    if (inBeforeSignUp && !isValidEmail(data.email_address)) {
      return this.setState({
        errorMessage: 'Please enter a valid email address',
      });
    }
    const formDataJSON = JSON.stringify(object);
    return submitFormFunction({
      url: 'https://v8pxyg84jj.execute-api.eu-west-1.amazonaws.com/dev/mailing-list',
      method,
      body: formDataJSON,
    })
      .then(response => {
        return response.json();
      })
      .then(res => {
        return this.setState(res);
      })
      .catch(() => {
        return this.setState({
          newsletterSubmitted: false,
        });
      });
  }

  render() {
    return (
      <div>
        {
          this.state.newsletterSubmitted
          ? <NewsletterAfterSignUp
            onSubmit={this.submitForm}
            updatedFormSubmitted={this.state.updatedFormSubmitted}
            errorMessage={this.state.errorMessage}
          />
          : <NewsletterBeforeSignUp
            onSubmit={this.submitForm}
            errorMessage={this.state.errorMessage}
          />
        }
      </div>
    );
  }
}

export default NewsLetter;
