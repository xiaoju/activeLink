import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import * as ActiveLinkAPI from '../../utils/ActiveLinkAPI';
import PageSection from '../layout/PageSection';
import SpinnerWrapper from '../SpinnerWrapper';

class UpdateMany extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      showingForm: true,
      loadingResult: false,
      showingResult: false,
      inputData: '',
      errorMessage: ''
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({
      showingForm: false,
      loadingResult: true,
      showingResult: false,
      errorMessage: ''
    });

    let result;
    try {
      result = await ActiveLinkAPI.updateMany({
        familyData: JSON.stringify(this.state.inputData),
        selectedAsso: 'a0',
        selectedEvent: 'e0'
      });

      // result = await axios.put('/api/v1/registerFromJSON', {
      //   familyData: this.state.inputData,
      //   selectedAsso: 'a0',
      //   selectedEvent: 'e0'
      // });
    } catch (err) {
      this.setState({
        showingForm: true,
        loadingResult: false,
        showingResult: false,
        errorMessage:
          'Something went wrong, sorry about this! ERROR: ' +
          err.response.data.error
      });
      return;
    }

    let { registrations, profile } = result.data;

    this.setState({
      showingForm: false,
      loadingResult: false,
      showingResult: true,
      registrations,
      profile
    });
  }

  render() {
    const {
      showingForm,
      loadingResult,
      showingResult,
      inputData,
      registrations,
      profile,
      errorMessage
    } = this.state;

    return (
      <PageSection sectionTitle="Input paper forms">
        {loadingResult && (
          <div className="container itemDetails">
            <SpinnerWrapper caption="Preparing and sending..." />
          </div>
        )}

        {errorMessage && (
          <div className="card-panel validationMessage">
            <strong>
              <p>{errorMessage}</p>
            </strong>
          </div>
        )}

        {showingForm && (
          <div>
            <h6 style={{ color: 'black' }}>The English Link</h6>
            <h6 style={{ color: 'black' }}>Registrations 2018-2019</h6>

            <form onSubmit={this.onSubmit} style={{ marginTop: '2em' }}>
              <div className="input-field loginEmail">
                <i className={'material-icons prefix icon-orange'}>send</i>
                <textarea
                  name="inputData"
                  value={inputData}
                  onChange={this.handleChange}
                  style={{
                    marginTop: '12em',
                    marginBottom: '1em',
                    height: '14em'
                  }}
                />
                <label
                  htmlFor="inputData"
                  className="double-line-label active"
                  style={{ width: '100%', lineHeight: '0.5em' }}
                >
                  Array of profiles AND registrations in json format (ONE family
                  only)<br />
                  <em styles={{ lineHeight: 'normal' }}>
                    <p>{'e.g.:'}</p>
                    <p>{'[{'}</p>
                    <p>{"primaryEmail: 'abc@example.com',"}</p>
                    <p>{'parents: [{firstName, familyName},{...}],'}</p>
                    <p>
                      {'children: [{firstName, familyName, kidGrade},{...}],'}
                    </p>
                    <p>{"photoConsent: 'true',"}</p>
                    <p>{'familyMedia: [{...},{...}],'}</p>
                    <p>{'addresses: [{...},{...}],'}</p>
                    <p>{'},{...},{...}]'}</p>
                  </em>
                </label>
              </div>

              <button
                className={
                  'waves-effect waves-light btn-large orange lighten-1'
                }
                type="submit"
                name="action"
              >
                <i className="material-icons left">send</i>
                Send
              </button>
            </form>
          </div>
        )}

        {showingResult && (
          <div>
            <h5>Result:</h5>
            <ul>
              <li>01</li>
              <li>02</li>
            </ul>
          </div>
        )}
      </PageSection>
    );
  }
}

export default connect(null, actions)(UpdateMany);
