import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../reducer/hook';
import { setNewItemMenuItem } from '../reducer/new-order-slice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { useTranslation } from 'react-i18next';
import { createNewItem } from '../reducer/item';
import { Item } from '../models/Item';
import { Category } from '../models/Category';
import callAPI from '../utils/apiCaller';

interface CreateItemFormProps {
  // Props if needed
}

const CreateItemForm: React.FC<CreateItemFormProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const language = useSelector((state: RootState) => state.cart.language);
  const { t } = useTranslation();

  const [name, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setPrice(newValue);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Item = {
      id: '',
      name,
      description,
      price,
      availableQuantity: 0,
      categoryId: category,
    };

    // Call the backend API to create a new item
    try {
      const action = await dispatch(createNewItem(newItem));
      const createdItem = action.payload;
      console.log('New item submitted:', createdItem);
      // Reset form fields
      setItemName('');
      setDescription('');
      setPrice(0);
      setCategory('');
      setImage(null);
      // Navigate to the next page or perform other actions
      navigate('/customize-order');
    } catch (error) {
      console.error('Failed to create a new item:', error);
    }
  };

  useEffect(() => {
    // Fetch categories from the backend API
    const fetchCategories = async () => {
      try {
        const response = await callAPI('/categories', 'GET');
        const fetchedCategories = response.data;
        setCategories(fetchedCategories as Category[]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="add-item-form box container ">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="item-name">
            Item Name:
          </label>
          <div className="control">
            <input
              type="text"
              id="item-name"
              value={name}
              onChange={handleItemNameChange}
              className="input"
            />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="description">
            Description:
          </label>
          <div className="control">
            <input
              type="text"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="input"
            />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="price">
            Price:
          </label>
          <div className="control">
            <input
              type="number"
              id="price"
              value={price}
              onChange={handlePriceChange}
              step="0.01"
              className="input"
            />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="category">
            Category:
          </label>
          <div className="control">
            <div className="select">
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="image">
            Image:
          </label>
          <div className="control">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="input"
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button type="submit" className="button is-primary">
              Add Item
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateItemForm;
