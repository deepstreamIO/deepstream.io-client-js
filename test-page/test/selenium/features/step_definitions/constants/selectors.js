module.exports = {
  ADD_CLIENT_INPUT: 'input#input-add-client',
  ADD_CLIENT_BUTTON: 'button#btn-add-client',
  CLIENT: '.client-component',
  CLIENT_WITH_ID: 'div.client-component#client-{clientId}',
  COMPONENTS: {
    LIST: {
      connection: 'div.connection-component',
      'error-logger': 'div.error-logger-component',
      authentication: 'div.authentication-component',
      records: 'div.records-component',
      events: 'div.events-component',
      rpcs: 'div.rpcs-component',
      presence: 'div.presence-component'
    },
    MAIN: '#app',
    APP: 'div#test-page-app',
    CLIENT: '.client-component',
    CONNECTION: {
      ROOT: '.connection-component',
      STATE_BUTTON: '.connection-state-btn',
      SERVER_ADDRESS_FIELD: '.connection-server-address'
    },
    ERROR_LOGGER: '.error-logger-component',
    AUTHENTICATION: {
      RELATIVE_ROOT: '#client-{clientId} > div > div > div.authentication-component',
      ROOT: 'div.authentication-component',
      FORM: 'form.auth-input-group',
      USERNAME_FIELD: 'input.auth-username-field',
      PASSWORD_FIELD: 'input.auth-password-field',
      LOGIN_BUTTON: 'button.auth-login-btn'
    },
    RECORDS: {
      ROOT: '.records-component',
      CREATE_RECORD_NAME_FIELD: 'input.record-name-field',
      CREATE_RECORD_SUBMIT_BUTTON: 'button.create-record-button',
      CREATED_RECORD_LABEL: "button.record-label[data-record-name='{recordName}']",
      CREATED_RECORD_SUBSCRIBE_BUTTON: "button.record-subscribe-button[data-record-name='{recordName}']",
      CREATED_RECORD_UNSUBSCRIBE_BUTTON: "button.record-unsubscribe-button[data-record-name='{recordName}']",
      SET: {
        RECORD_ATTRIBUTE_NAME_FIELD: "input.record-set-attribute-name-field[data-record-name='{recordName}']",
        RECORD_ATTRIBUTE_VALUE_FIELD: "input.record-set-attribute-value-field[data-record-name='{recordName}']",
        RECORD_ATTRIBUTE_SUBMIT_BUTTON: "button.record-set-submit-button[data-record-name='{recordName}']",
        RECORD_SUBSCRIPTION_UPDATES_FIELD: "pre.record-subscription-latest-update[data-record-name='{recordName}']",
      },
      SNAPSHOT: {
        RECORD_NAME_FIELD: 'input.record-snapshot-field',
        BUTTON: 'button.record-snapshot-button',
        PREVIEW_ELEMENT: 'pre.record-snapshot-preview',
      },
      HAS: {
        STATUS_LABEL: "button.has-record-status-btn[data-record-name='{recordName}']",
        RECORDNAME_FIELD: 'input.has-record-name-input',
        SUBMIT_BUTTON: 'button.has-record-submit-button'
      },
      LISTENING: {
        LISTEN_BUTTON: 'div.records-component > div > div > div.listening > div > div:nth-child(3) > button'
      }
    },
    EVENTS: {
      RELATIVE_ROOT: '#client-{clientId} > div > div > .events-component',
      ROOT: '.events-component',
      SUBSCRIBE: {
        EVENT_NAME_FIELD: 'input.subscribe-event-name-input',
        SUBMIT_BUTTON: 'button.subscribe-event-submit-btn',
        SUBSCRIBED_EVENTS: {
          LABEL: "td.subscribe-event-label[data-event-name='{eventName}']",
          UPDATES_FIELD: "span.subscribe-event-updates-field[data-event-name='{eventName}']"
        }
      },
      EMIT: {
        EVENT_NAME_FIELD: 'input.emit-event-name-field',
        EVENT_DATA_FIELD: 'input.emit-event-data-field',
        SUBMIT_BUTTON: 'button.emit-event-submit-btn'
      },
      LISTENING: {
        LISTEN_BUTTON: 'div.events-component > div > div > div.listening > div > div:nth-child(3) > button'
      }
    },
    RPCS: {
      RELATIVE_ROOT: '#client-{clientId} > div > div > .rpcs-component',
      RPC_LABEL: ".rpc-label-{rpcName}[data-rpc-name='{rpcName}']",
      MAKE_BUTTON: 'button#make-btn-rpc-{rpcName}.rpc-make-btn',
      PROVIDE_BUTTON: 'button#provide-btn-rpc-{rpcName}.rpc-provide-btn',
      DATA_FIELD: 'input#data-field-rpc-{rpcName}.rpc-data-field',
      RESPONSE_FIELD: "span.rpc-response[data-rpc-name='{rpcName}']:nth-child(1)"
    },
    PRESENCE: {
      AVAILABLE_USERS: {
        LABEL: {
          LIST: 'div.presence-users-list',
          OFFLINE_USER_BUTTON: 'div.presence-users-list > div:nth-child({n}) > button.btn-outline-primary.presence-users-member',
          ONLINE_USER_BUTTON: 'div.presence-users-list > div:nth-child({n}) > button.btn-outline-success.presence-users-member',
          OFFLINE_USER_BUTTON_WITH_ID: 'button#presence-member-{userName}.presence-users-member.btn-outline-primary',
          ONLINE_USER_BUTTON_WITH_ID: 'button#presence-member-{userName}.presence-users-member.btn-outline-success'
        }
      },
      QUERY: {
        EVERYONE: {
          BUTTON: 'button.presence-query-all',
          RESULT_FIELD: 'td#query-id-{id}.query-result-all'
        },
        SPECIFIC: {
          BUTTON: 'button.presence-query-specific',
          INPUT_FIELD: 'input.presence-query-specific-input',
          RESULT_FIELD: 'td#query-id-{id}.query-result-specific'
        },
        SUBSCRIBE: {
          FIELD: 'input.presence-subscribe-input',
          BUTTON: 'button.presence-subscribe-button',
          USERS: {
            LABEL: 'td#subscribe-label-username-{username}',
            STATUS: 'td#subscribe-status-username-{username}'
          }
        }
      }
    }
  }
}
