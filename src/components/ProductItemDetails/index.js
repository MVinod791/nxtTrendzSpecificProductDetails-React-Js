// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiConstantsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemData: {},
    similarProductsData: [],
    apiStatus: apiConstantsStatus.initial,
    count: 1,
  }

  componentDidMount() {
    this.getProductItemData()
  }

  getProductItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiConstantsStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const updateData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      const updateSimilaraData = data.similar_products.map(eachData => ({
        availability: eachData.availability,
        brand: eachData.brand,
        description: eachData.description,
        id: eachData.id,
        imageUrl: eachData.image_url,
        price: eachData.price,
        rating: eachData.rating,
        style: eachData.style,
        title: eachData.title,
        totalReviews: eachData.total_reviews,
      }))
      this.setState({
        productItemData: updateData,
        similarProductsData: updateSimilaraData,
        apiStatus: apiConstantsStatus.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiConstantsStatus.failure,
      })
    }
  }

  onClickMinus = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  onClickPlus = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderProductItemView = () => {
    const {productItemData, similarProductsData, count} = this.state
    const {
      imageUrl,
      availability,
      brand,
      description,
      rating,
      price,
      title,
      totalReviews,
    } = productItemData
    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">RS {price}</p>
            <div className="rating-and-reviews-count">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="label-value-container">
              <p className="availability">Availability:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="brand">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <hr className="line" />
            <div className="quantity-container">
              <button
                testid="minus"
                className="button"
                type="button"
                onClick={this.onClickMinus}
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p className="quantity">{count}</p>
              <button
                testid="plus"
                type="button"
                className="button"
                onClick={this.onClickPlus}
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button className="add-to-cart-btn" type="button">
              Add To Cart
            </button>
          </div>
        </div>
        <ul className="similar-product-list">
          {similarProductsData.map(eachSimilarData => (
            <SimilarProductItem
              similarProductDetails={eachSimilarData}
              key={eachSimilarData.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="product-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products" className="link-item">
        <button className="continue-btn" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstantsStatus.success:
        return this.renderProductItemView()
      case apiConstantsStatus.failure:
        return this.renderFailureView()
      case apiConstantsStatus.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
