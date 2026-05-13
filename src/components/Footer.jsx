import { Link } from 'react-router-dom'
import { IoCarSport } from 'react-icons/io5'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3><IoCarSport style={{ marginRight: 8 }} />Ришаб Каин</h3>
          <p>India's most trusted pre-owned car marketplace. We help you find, buy, and sell quality second-hand cars with confidence and transparency.</p>
        </div>
        <div className="footer-col">
          <h4>Buy Cars</h4>
          <Link to="/listings?brand=Suzuki">Suzuki</Link>
          <Link to="/listings?brand=Audi">Audi</Link>
          <Link to="/listings?brand=BMW">BMW</Link>
          <Link to="/listings?brand=Ford">Ford</Link>
          <Link to="/listings?brand=Honda">Honda</Link>
          <Link to="/listings?brand=KIA">KIA</Link>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <Link to="/sell">Sell Your Car</Link>
          <Link to="/test-drive">Book Test Drive</Link>
          <Link to="/compare">Compare Cars</Link>
          <Link to="/listings">Browse Listings</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        © 2024 Ришаб Каин (Rishabh Kain). All rights reserved. Built with ❤️ in India.
      </div>
    </footer>
  )
}
