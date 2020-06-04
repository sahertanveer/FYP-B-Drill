import React, { Component } from 'react'
import { withRouter, BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from '../../layout/Alert'
import { uploadPhoto } from '../../actions/profileAction'
import { setAlert } from '../../actions/alertAction'

class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.setAlert("Wait for image to upload...", 'warning')
        const formData = new FormData();
        formData.append('myImage', this.state.file);
        this.props.uploadPhoto(formData);

    }

    handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)
    }

    render() {
        let { imagePreviewUrl } = this.state;
        let imagePreview = null;
        if (imagePreviewUrl) {
            imagePreview = (<img src={imagePreviewUrl} />);
        } else {
            imagePreview = (<div className="previewText center">Please select an Image for Preview</div>);
        }

        return (
            <div className="container-fluid">
                <div className="card animate fadeLeft">
                    <div className="card-content mycard" style={{ backgroundColor: '#1fa398' }}>
                        <b><h5 className="card-stats-number  center">Upload Image</h5></b>
                    </div>
                    <div className="card-action center">
                        <div className="previewComponent">
                            <Alert />
                            <form onSubmit={(e) => this.handleSubmit(e)}>
                                <input className="fileInput black-text"
                                    type="file"
                                    onChange={(e) => this.handleImageChange(e)}
                                />


                                <div className="avatarWrapper">
                                    <div className="avatarNav ">
                                        <a href="#" className="avZoomIn" data-placement="right" title="Zoom In"><span className="fa fa-plus-circle white-text"></span></a>
                                        <a href="#" className="avZoomOut" data-placement="right" title="Zoom Out"><span className="fa fa-minus-circle white-text"></span></a>
                                        <button type='submit' className="avSave" data-placement="right" title="Upload"><i className="fas fa-upload" style={{ color: "#1fa398" }} /></button>
                                        <span className="divider"><span className="fa fa-ellipsis-h "></span></span>
                                        <a href="#" className="avDelete" data-toggle="tooltip" data-placement="right" title="Delete"><span className="fa fa-trash grey-text"></span></a>
                                        {this.props.auth && this.props.auth.role === "manager" ?
                                            <a href="/managerprofile" className="avDelete" data-toggle="tooltip" data-placement="right" title="Delete"><span className="fa fa-trash grey-text"></span></a>
                                            : <a href="/candprofile" className="avDelete" data-toggle="tooltip" data-placement="right" title="Delete"><span className="fa fa-trash grey-text"></span></a>
                                        }
                                    </div>
                                    <div className="avatar cursor-move">
                                        <div className="imgPreview center">
                                            {imagePreview}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

ImageUpload.propTypes = {
    uploadPhoto: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    setPage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps, { uploadPhoto, setAlert })(withRouter(ImageUpload));
