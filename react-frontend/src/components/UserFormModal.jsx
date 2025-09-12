import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './UserFormModal.css';

function UserFormModal({ isOpen, onRequestClose, user, onSuccess }) {
  const [form, setForm] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    role: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ ...user, password: '' });
    } else {
      setForm({ matricule: '', nom: '', prenom: '', role: '', password: '' });
    }
    // Reset errors when modal opens/closes
    setErrors({});
    setSubmitError('');
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    }
    
    if (!form.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!form.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    if (!form.role) {
      newErrors.role = 'Le rôle est requis';
    }
    
    // Password is required only for new users
    if (!user && !form.password && form.role !== 'trieur') {
      newErrors.password = 'Le mot de passe est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const headers = { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      // Only include password if it's not empty
      const formData = { ...form };
      if (!formData.password) {
        delete formData.password;
      }
      
      if (user) {
        await axios.put(
          `http://localhost:8000/api/users/${user.id_user}`, 
          formData, 
          { headers }
        );
      } else {
        await axios.post(
          `http://localhost:8000/api/users`, 
          formData, 
          { headers }
        );
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          // Format validation errors from backend
          const backendErrors = {};
          Object.entries(error.response.data.errors).forEach(([key, messages]) => {
            backendErrors[key] = Array.isArray(messages) ? messages[0] : messages;
          });
          setErrors(backendErrors);
        } else {
          setSubmitError(error.response.data.message || 'Une erreur est survenue lors de la sauvegarde');
        }
      } else {
        setSubmitError('Erreur de connexion au serveur');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose}
      className="user-modal-content"
      overlayClassName="user-modal-overlay"
      closeTimeoutMS={300}
    >
      <div className="modal-header">
        <h2>{user ? 'Modifier' : 'Ajouter'} un utilisateur</h2>
        <button className="close-button" onClick={onRequestClose}>&times;</button>
      </div>
      
      {submitError && (
        <div className="submit-error-message">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="matricule">Matricule</label>
          <input 
            id="matricule"
            className="form-input"
            name="matricule" 
            value={form.matricule} 
            onChange={handleChange} 
            placeholder="Saisir le matricule" 
          />
          {errors.matricule && <div className="error-message">{errors.matricule}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input 
            id="nom"
            className="form-input"
            name="nom" 
            value={form.nom} 
            onChange={handleChange} 
            placeholder="Saisir le nom" 
          />
          {errors.nom && <div className="error-message">{errors.nom}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="prenom">Prénom</label>
          <input 
            id="prenom"
            className="form-input"
            name="prenom" 
            value={form.prenom} 
            onChange={handleChange} 
            placeholder="Saisir le prénom" 
          />
          {errors.prenom && <div className="error-message">{errors.prenom}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Rôle</label>
          <select 
            id="role"
            className="form-select"
            name="role" 
            value={form.role} 
            onChange={handleChange}
          >
            <option value="">Sélectionner un rôle</option>
            <option value="admin">Administrateur</option>
            <option value="chef d'equipe">Chef d'équipe</option>
            <option value="enfourneur">Enfourneur</option>
            <option value="trieur">Trieur</option>
          </select>
          {errors.role && <div className="error-message">{errors.role}</div>}
        </div>
        
        {(form.role !== 'trieur' || !user) && (
          <div className="form-group">
            <label htmlFor="password">
              {user ? 'Mot de passe (laisser vide pour ne pas modifier)' : 'Mot de passe'}
            </label>
            <input 
              id="password"
              className="form-input"
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder={user ? '••••••••' : 'Saisir le mot de passe'}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onRequestClose}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UserFormModal;