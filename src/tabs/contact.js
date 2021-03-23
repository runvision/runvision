

// import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { simpleAjaxRequest } from '../helpers/simple-ajax-request'

// type SubmissionStatus = "INITIAL" | "LOADING" | "SUCCESS" | "ERROR";

const removeProperty = (obj, propertyName) => {
  const { [propertyName]: _, ...result } = obj;
  return result;
};

const InputErrors = ({
  errors,
}) => {
  if (!errors || errors.length === 0) {
    return null;
  }
  if (typeof errors === "string") {
    errors = [errors];
  }
  return <aside className="input-errors">{errors.join(",")}</aside>;
};

export const ContactPage = ({ close, ...props } ) => {
  const [status, setStatus] = useState("INITIAL");
  const [errors, setErrors] = useState({});
  let timer = null;
  useEffect(() => {
    // componentDidMount
    return () => {
      clearTimeout(timer);
    };
  }, [timer]);
  const validateForm = (data) => {
    let errors = {};
    const validators = {
      name: (value) => {
        if (value.length <= 1) {
          return { name: ["Name is too short"] };
        }
        return {};
      },
      email: (value) => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          return { email: ["Is not a valid email address"] };
        }
        return {};
      },
      message: (value) => {
        if (value.length <= 5) {
          return { message: ["Message is too short"] };
        }
        return {};
      },
      _gotcha: (value) => {
        if (value.length >= 1) {
          return { _gotcha: ["Are you sure you're not a robot?"] };
        }
        return {};
      },
      _subject: (value) => ({}),
    };
    for (const [key, value] of data.entries()) {
      errors = {
        ...errors,
        ...validators[key](value),
      };
    }
    return errors;
  };
  const submitForm = async (ev) => {
    ev.preventDefault();
    setStatus("LOADING");
    const form = ev.target;
    const data = new FormData(form);
    const errors = validateForm(data);
    if (Object.keys(errors).length !== 0) {
      setErrors(errors);
      // setStatus("ERROR");
      timer = setTimeout(() => {
        setStatus("ERROR");
      }, 800);
      return;
    }
    try {
      const response = await simpleAjaxRequest(form.method, form.action, data);
      // form.reset();
      timer = setTimeout(() => {
        setStatus("SUCCESS");
      }, 1200);
      // setStatus("SUCCESS");
    } catch (err) {
      setStatus("ERROR");
      setErrors({ other: [err.error] });
    }
  };
  const onKeyPress = (event) => {
    const { name } = event.currentTarget;
    setErrors(removeProperty(errors, name));
  };
  return (
    <article
      id="contact"
      className={`${props.article === 'contact' ? 'active' : ''} ${
        props.articleTimeout ? 'timeout' : ''
      }`}
      style={{ display: 'none' }}
    >
      <h2 className="major">Contact</h2>
      {status !== "SUCCESS" ? (
      <form onSubmit={submitForm} action={process.env.GATSBY_CONTACT_FORM_URL} method="POST">
        <input name="_gotcha" style={{ display: "none" }} type="text" />
        <input type="hidden" name="_subject" value="(Auto RV)" />
        <div className="field half first">
          <label htmlFor="name">Your Name</label>
          <input type="text" name="name" onKeyPress={onKeyPress} />
          <InputErrors errors={errors["name"]} />
        </div>
        <div className="field half">
          <label htmlFor="email">Your Email</label>
          <input type="text" name="email" onKeyPress={onKeyPress} />
          <InputErrors errors={errors["email"]} />
        </div>
        <div className="field">
          <label htmlFor="message">How can we help?</label>
          <textarea name="message" id="message" rows="4" onKeyPress={onKeyPress}></textarea>
          <InputErrors errors={errors["message"]} />
        </div>
        <ul className="actions">
          <li>
            <input type="submit" value="Send Message" className="special" disabled={status === "LOADING"} />
          </li>
          {/* <li>
            <input type="reset" value="Reset" />
          </li> */}
        </ul>
      </form>) : (
        <div style={{marginBottom: "30px"}}>Thank you for your message.</div>
      )}
      <ul className="icons">
        <li>
          <a
            href="https://twitter.com/ttt"
            className="icon fa-twitter"
          >
            <span className="label">Twitter</span>
          </a>
        </li>
        <li>
          <a href="https://codebushi.com" className="icon fa-facebook">
            <span className="label">Facebook</span>
          </a>
        </li>
        <li>
          <a href="https://codebushi.com" className="icon fa-instagram">
            <span className="label">Instagram</span>
          </a>
        </li>
      </ul>
      {close}
    </article>
  );
}