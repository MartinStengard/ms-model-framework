
const MSModel = (modelName, fields, prePopulate) => {
  const timestamp = Date.now().toString();
  const baseModelName = `${modelName}_${timestamp}`;
  const props = {};
  const validators = {};
  const errors = {};

  /**
   * @private
   * @function init
   * @description
   * Creates model structure.
   * Populates model with data if supplied.
   * Model name need to be unique and gets an timestamp attached.
   * @returns {undefined}
   */
  const init = () => {
    fields.forEach((field) => {
      props[field.name] = field.value;
      if (field.validator) {
        validators[field.name] = field.validator;
      }
    });

    if (prePopulate) {
      Object.entries(prePopulate).forEach(([key, value]) => {
        props[key] = value;
      });
    }


  };

  /**
  * @private
  * @function sendEvent
  * @description
  * Dispatches events for specific field
  * @param {string} type type of event.
  * @param {string} field property name.
  * @return {void}
  */
  const sendEvent = (type, field) => {
    document.dispatchEvent(new Event(`${baseModelName}->${type}:${field}`));
  };

  /**
   * @public
   * @function sendManualErrorEvent
   * @description
   * Sets temporary error text to property and dispatch error event.
   * @param {string|null} field prop name or null
   * @param {string} message error message to set
   * @return {undefined}
   */
  const sendManualErrorEvent = (field, message) => {
    errors[field] = message;
    sendEvent('error', field);
  };

  /**
   * @public
   * @function sendIsValidEvent
   * @description
   * Dispatches true/false is model is valid. Also calls callback supplied
   * from UI as a shortcut for any one that wants to listen to valid event.
   * @return {undefined}
   */
  const sendIsValidEvent = () => {
    const isValid = Object.keys(errors).length <= 0;

    if (_isValidEventListenerCallback) {
      _isValidEventListenerCallback(isValid);
    }

    document.dispatchEvent(new Event(`${baseModelName}->valid:${isValid}`));
  };

  /**
   * @private
   * @function _isValidEventListenerCallback
   * @description
   * Callback placeholder to respond if model valid changes.
   */
  let _isValidEventListenerCallback = null;
  /**
   * @public
   * @function addIsValidEventListener
   * @description
   * Adds callback to respond if model valid changes instead of attaching
   * a true event listener.
   */
  const addIsValidEventListener = (callback) => {
    _isValidEventListenerCallback = callback;
  };

  /**
  * @private
  * @function isPropValid
  * @description
  * Validates specified property in model.
  * Always pass fields without validator through.
  * @param {string} field property name.
  * @return {boolean} true if property is valid.
  */
  const isPropValid = function (field) {
    const value = props[field] || '';
    const currentFieldError = (validators[field]) ? validators[field](value) : true;

    if (currentFieldError != true) {
      errors[field] = currentFieldError;
    } else {
      delete errors[field];
    }

    return !errors.hasOwnProperty(field);
  };

  /**
  * @public
  * @function set
  * @description
  * Sets new value to model and validate it.
  * Does nothing if property name do not exists
  * Returns true if no validator added (do not allow update).
  * @param {string} field property name.
  * @param {string} value property value.
  * @return {boolean} true if property is valid.
  */
  const set = (field, value) => {
    if (!props.hasOwnProperty(field)) {
      // tg.warn(`Property ${field} missing in ${baseModelName}`);
      return false;
    }

    if (!validators[field]) {
      return true;
    }

    props[field] = value;
    const valid = isPropValid(field);
    sendEvent('changed', field);
    sendIsValidEvent();

    return valid;
  };

  /**
  * @public
  * @function mapToProps
  * @description
  * Maps object keys and values to internal props.
  * @param {object} keyValuePair object with keys and values.
  * @return {undefined}
  */
  const mapToProps = (keyValuePair) => {
    Object.entries(keyValuePair).forEach(([key, value]) => {
      set(key, value);
    });
  };

  /**
   * @public
   * @function error
   * @description
   * Gets error text (if exists) for field.
   * @param field prop field name
   * @return {string} current field error
   */
  const error = (field) => (errors[field] || '');

  /**
   * @public
   * @function isValid
   * @description
   * Validates single field or all properties and updates error object.
   * @param {string|null} field prop name or null
   * @return {boolean} true if field/model is valid
   */
  const isValid = (field) => {
    if (field && props.hasOwnProperty(field)) {
      return isPropValid(field);
    }

    Object.entries(props).forEach(([field]) => {
      if (props.hasOwnProperty(field)) {
        isPropValid(field);
      }
    });

    sendIsValidEvent();

    return Object.keys(errors).length <= 0;
  };

  // Creates model.
  init();

  return {
    name: baseModelName,
    props,
    set,
    mapToProps,
    error,
    errors,
    isValid,
    sendManualErrorEvent,
    addIsValidEventListener,
  };
};

export default MSModel;
