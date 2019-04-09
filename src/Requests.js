
(function (tg, $) {

  tg.requests = new function () {
    // Base request object that all AJAX calls inherit from
    var _baseRequest = function () {
      this.dataType = 'json';
      this.contentType = 'application/json; charset=utf-8';
      this.crossDomain = true;
    };

		/**
		 * @private
		 * @function
		 * @description
		 * Returns any error as json result.
		 * @return {object} error message with status
		 */
    var _errorHandler = function (xhr) {
      return _getReponse(xhr);
    };

    var _apiExists = (api) => {
      if (api == null || api.toString().trim() == '') {
        tg.warn('API url is missing');
        return false;
      }
      return true;
    };

    // Safe method to transform AJAX response
    var _getReponse = function (error) {
      if (error.responseJSON) {
        return error.responseJSON;
      } else if (error.responseText) {
        return { status: error.status, message: error.responseText };
      } else if (error.response) {
        return { status: error.status, message: error.response };
      } else {
        return { message: error };
      }
    };

    // GET - Base method for all GET calls for AJAX
    var _get = function (url, success, error, complete) {
      _baseRequest.apply(this, arguments);
      this.url = url;
      this.type = 'GET';
      this.success = success;
      this.error = error || _errorHandler;
      this.complete = complete;
    };

    // POST - Base method for all POST calls for AJAX
    var _post = function (url, data, success, error, complete) {
      _baseRequest.apply(this, arguments);
      this.url = url;
      this.type = 'POST';
      this.success = success;
      this.data = data == null ? null : JSON.stringify(data);
      this.error = error || _errorHandler;
      this.complete = complete;
    };

    // PUT - Base method for all PUT calls for AJAX
    var _put = function (url, data, success, error, complete) {
      _baseRequest.apply(this, arguments);
      this.url = url;
      this.type = 'PUT';
      this.data = data == null ? null : JSON.stringify(data);
      this.success = success;
      this.error = error || _errorHandler;
      this.complete = complete;
    };

    // DELETE - Base method for all DELETE calls for AJAX
    var _delete = function (url, success, error, complete) {
      _baseRequest.apply(this, arguments);
      this.url = url;
      this.type = 'DELETE';
      this.success = success;
      this.error = error || _errorHandler;
      this.complete = complete;
    };

    this.get = function (api) {
      return {
        response: function (success, error, complete) {
          if (!_apiExists(api)) return;

          let _error = _errorHandler;

          // Encapsulate error message to supplied error method.
          if (error) {
            _error = (xhr) => {
              error(_getReponse(xhr));
            };
          }

          try {
            api = tg.apiEndpoint + api;
            success = success || null;
            return $.ajax(new _get(api, success, _error, complete));
          } catch (e) {
            _error(`Unhandled error in requests.get(${api}): ${e.description}`);
          }
        }
      };
    };

    this.post = function (api, data) {
      return {
        response: function (success, error, complete) {
          if (!_apiExists(api)) return;

          let _error = _errorHandler;

          // Encapsulate error message to supplied error method.
          if (error) {
            _error = (xhr) => {
              error(_getReponse(xhr));
            };
          }

          try {
            api = tg.apiEndpoint + api;
            success = success || null;
            return $.ajax(new _post(api, data, success, _error, complete));
          } catch (e) {
            _error(`Unhandled error in requests.post(${api}): ${e.description}`);
          }
        }
      };
    };

    this.put = function (api, data) {
      return {
        response: function (success, error, complete) {
          if (!_apiExists(api)) return;

          let _error = _errorHandler;

          // Encapsulate error message to supplied error method.
          if (error) {
            _error = (xhr) => {
              error(_getReponse(xhr));
            };
          }

          try {
            api = tg.apiEndpoint + api;
            success = success || null;
            return $.ajax(new _put(api, data, success, _error, complete));
          } catch (e) {
            _error(`Unhandled error in requests.put(${api}): ${e.description}`);
          }
        }
      };
    };

    this.delete = function (api) {
      return {
        response: function (success, error, complete) {
          if (!_apiExists(api)) return;

          error = error || _errorHandler;

          try {
            // Add api url to BAIS from config
            api = tg.apiEndpoint + api;

            // Get success and error callbacks if supplied
            success = success || null;

            // Make call to BAIS
            $.ajax(new _delete(api, success, error, complete));

          } catch (e) {
            error(`Unhandled error in requests.put(${api}): ${e.description}`);
          }
        }
      };
    };

  };

})(window.tg = window.tg || {}, jQuery);
