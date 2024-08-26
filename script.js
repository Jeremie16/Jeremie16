const validCoupons = {
      'PROMO10': { discount: '10%', expiry: '2023-12-31', minCartTotal: 50, stores: ['store1', 'store2'], categories: ['electronics', 'clothing'] },
      'SUMMER20': { discount: '20%', expiry: '2023-08-31', minCartTotal: 100, stores: ['store2', 'store3'], categories: ['clothing'] },
      'WELCOME15': { discount: '15%', expiry: '2023-12-31', minCartTotal: 0, stores: ['store1', 'store2', 'store3'], categories: ['electronics', 'clothing', 'food'], newCustomerOnly: true },
      'FOOD5': { discount: '5%', expiry: '2023-12-31', minCartTotal: 30, stores: ['store3'], categories: ['food'] }
    };

    const stores = ['store1', 'store2', 'store3'];
    const categories = ['electronics', 'clothing', 'food'];

    document.addEventListener('DOMContentLoaded', () => {
      populateDropdown('storeSelect', stores);
      populateDropdown('productCategory', categories);
      
      document.getElementById('verifyButton').addEventListener('click', verifyCoupon);
      document.getElementById('couponInput').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') verifyCoupon();
      });
    });

    function populateDropdown(id, options) {
      const select = document.getElementById(id);
      options.forEach(option => {
        const el = document.createElement('option');
        el.textContent = option;
        el.value = option;
        select.appendChild(el);
      });
    }

    async function verifyCoupon() {
      showLoading();
      const couponInput = document.getElementById('couponInput');
      const resultDiv = document.getElementById('result');
      const coupon = couponInput.value.trim().toUpperCase();
      const selectedStore = document.getElementById('storeSelect').value;
      const selectedCategory = document.getElementById('productCategory').value;
      const cartTotal = parseFloat(document.getElementById('cartTotal').value) || 0;
      const isNewCustomer = document.getElementById('newCustomer').checked;
      
      let message = '';
      let isValid = false;

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call

      if (validCoupons.hasOwnProperty(coupon)) {
        const { discount, expiry, minCartTotal, stores, categories, newCustomerOnly } = validCoupons[coupon];
        const expiryDate = new Date(expiry);
        const currentDate = new Date();

        if (expiryDate > currentDate) {
          if (cartTotal >= minCartTotal) {
            if (stores.includes(selectedStore) || selectedStore === '') {
              if (categories.includes(selectedCategory) || selectedCategory === '') {
                if (!newCustomerOnly || (newCustomerOnly && isNewCustomer)) {
                  message = `Coupon valide ! Vous bénéficiez d'une réduction de ${discount}.`;
                  isValid = true;
                } else {
                  message = 'Ce coupon est réservé aux nouveaux clients.';
                }
              } else {
                message = 'Ce coupon n\'est pas valide pour cette catégorie de produits.';
              }
            } else {
              message = 'Ce coupon n\'est pas valide pour ce magasin.';
            }
          } else {
            message = `Le montant minimum du panier pour ce coupon est de ${minCartTotal}€.`;
          }
        } else {
          message = 'Ce coupon a expiré.';
        }
      } else {
        message = 'Coupon invalide.';
      }
      
      resultDiv.textContent = message;
      resultDiv.className = isValid ? 'valid' : 'invalid';
      
      fadeInElement(resultDiv);

      if (!isValid) {
        shakeCouponInput(couponInput);
      }

      addToHistory(coupon, isValid, message);
      hideLoading();
    }
    
    function addToHistory(coupon, isValid, message) {
      const historyList = document.getElementById('historyList');
      const listItem = document.createElement('li');
      listItem.textContent = `${coupon} - ${isValid ? 'Valide' : 'Invalide'} : ${message}`;
      listItem.style.color = isValid ? 'var(--secondary-color)' : 'var(--accent-color)';
      historyList.insertBefore(listItem, historyList.firstChild);

      if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
      }
    }
    
    function fadeInElement(element) {
      element.style.opacity = '0';
      setTimeout(() => {
        element.style.opacity = '1';
      }, 10);
    }

    function shakeCouponInput(element) {
      element.style.animation = 'shake 0.5s';
      setTimeout(() => {
        element.style.animation = 'none';
      }, 500);
    }

    function showLoading() {
      document.getElementById('loading').style.display = 'flex';
    }

    function hideLoading() {
      document.getElementById('loading').style.display = 'none';
    }