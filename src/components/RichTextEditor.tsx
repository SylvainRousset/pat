'use client';

import React, { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Saisissez votre description...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fonction pour exécuter les commandes de formatage
  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Vérifier s'il y a une sélection de texte
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        // Pas de sélection, créer une sélection temporaire
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      
      // Exécuter la commande
      const success = document.execCommand(command, false, value);
      
      if (success) {
        // Mettre à jour le contenu après un court délai
        setTimeout(() => {
          if (editorRef.current && !isUpdating) {
            setIsUpdating(true);
            const content = editorRef.current.innerHTML;
            if (content !== value) {
              onChange(content);
            }
            setIsUpdating(false);
          }
        }, 50);
      }
    }
  };

  // Fonction pour vérifier si une commande est active
  const isCommandActive = (command: string): boolean => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  // Fonction pour obtenir la police sélectionnée
  const getFontFamily = (): string => {
    try {
      return document.queryCommandValue('fontName') || 'Arial';
    } catch {
      return 'Arial';
    }
  };

  // Fonction pour obtenir la taille de police sélectionnée
  const getFontSize = (): string => {
    try {
      return document.queryCommandValue('fontSize') || '3';
    } catch {
      return '3';
    }
  };

  // Gérer les changements de contenu
  const handleInput = () => {
    if (editorRef.current && !isUpdating) {
      setIsUpdating(true);
      const content = editorRef.current.innerHTML;
      if (content !== value) {
        onChange(content);
      }
      setIsUpdating(false);
    }
  };

  // Initialiser le contenu
  useEffect(() => {
    if (editorRef.current && !isUpdating) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isUpdating]);

  return (
    <div className={`rich-text-editor border border-gray-300 rounded-md ${className}`}>
      {/* Barre d'outils */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Formatage de base */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className={`p-2 rounded hover:bg-gray-200 ${isCommandActive('bold') ? 'bg-[#a75120] text-white' : 'text-gray-700'}`}
            title="Gras"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className={`p-2 rounded hover:bg-gray-200 ${isCommandActive('italic') ? 'bg-[#a75120] text-white' : 'text-gray-700'}`}
            title="Italique"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className={`p-2 rounded hover:bg-gray-200 ${isCommandActive('underline') ? 'bg-[#a75120] text-white' : 'text-gray-700'}`}
            title="Souligné"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => execCommand('strikeThrough')}
            className={`p-2 rounded hover:bg-gray-200 ${isCommandActive('strikeThrough') ? 'bg-[#a75120] text-white' : 'text-gray-700'}`}
            title="Barré"
          >
            <s>S</s>
          </button>
        </div>

        {/* Titres */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'normal') {
                execCommand('formatBlock', 'div');
              } else {
                execCommand('formatBlock', value);
              }
            }}
            className="p-1 border border-gray-300 rounded text-sm"
            title="Titre"
          >
            <option value="normal">Normal</option>
            <option value="h1">Titre 1</option>
            <option value="h2">Titre 2</option>
            <option value="h3">Titre 3</option>
          </select>
        </div>

        {/* Couleurs prédéfinies */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => execCommand('foreColor', '#000000')}
                className="w-6 h-6 bg-black border border-gray-300 rounded cursor-pointer"
                title="Texte noir"
              />
              <button
                type="button"
                onClick={() => execCommand('foreColor', '#ffffff')}
                className="w-6 h-6 bg-white border border-gray-300 rounded cursor-pointer"
                title="Texte blanc"
              />
              <button
                type="button"
                onClick={() => execCommand('foreColor', '#dc2626')}
                className="w-6 h-6 bg-red-600 border border-gray-300 rounded cursor-pointer"
                title="Texte rouge"
              />
              <button
                type="button"
                onClick={() => execCommand('foreColor', '#2563eb')}
                className="w-6 h-6 bg-blue-600 border border-gray-300 rounded cursor-pointer"
                title="Texte bleu"
              />
              <button
                type="button"
                onClick={() => execCommand('foreColor', '#16a34a')}
                className="w-6 h-6 bg-green-600 border border-gray-300 rounded cursor-pointer"
                title="Texte vert"
              />
              <button
                type="button"
                onClick={() => execCommand('foreColor', '#a75120')}
                className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                style={{ backgroundColor: '#a75120' }}
                title="Texte marron"
              />
            </div>
            <div className="flex gap-1">
              <input
                type="color"
                value="#000000"
                onChange={(e) => execCommand('foreColor', e.target.value)}
                className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                title="Couleur personnalisée du texte"
              />
              <input
                type="color"
                value="#ffffff"
                onChange={(e) => execCommand('backColor', e.target.value)}
                className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                title="Couleur personnalisée d'arrière-plan"
              />
            </div>
          </div>
        </div>

        {/* Police */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <select
            onChange={(e) => execCommand('fontName', e.target.value)}
            value={getFontFamily()}
            className="p-1 border border-gray-300 rounded text-sm"
            title="Police"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Helvetica">Helvetica</option>
          </select>
        </div>

        {/* Taille */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <select
            onChange={(e) => execCommand('fontSize', e.target.value)}
            value={getFontSize()}
            className="p-1 border border-gray-300 rounded text-sm"
            title="Taille"
          >
            <option value="1">Très petit</option>
            <option value="2">Petit</option>
            <option value="3">Normal</option>
            <option value="4">Moyen</option>
            <option value="5">Grand</option>
            <option value="6">Très grand</option>
            <option value="7">Énorme</option>
          </select>
        </div>

        {/* Listes */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
            title="Liste à puces"
          >
            • Liste
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
            title="Liste numérotée"
          >
            1. Liste
          </button>
        </div>

        {/* Alignement */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => execCommand('justifyLeft')}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
            title="Aligner à gauche"
          >
            ⬅
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyCenter')}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
            title="Centrer"
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyRight')}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
            title="Aligner à droite"
          >
            ➡
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => {
              const url = prompt('Entrez l\'URL du lien:');
              if (url) {
                execCommand('createLink', url);
              }
            }}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
            title="Insérer un lien"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={() => execCommand('removeFormat')}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
            title="Supprimer le formatage"
          >
            🧹
          </button>
        </div>
      </div>

      {/* Zone d'édition */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-32 p-3 focus:outline-none ${isFocused ? 'ring-2 ring-[#a75120] ring-opacity-50' : ''}`}
        style={{
          backgroundColor: 'white',
          fontSize: '14px',
          lineHeight: '1.5',
          fontFamily: 'inherit'
        }}
        data-placeholder={placeholder}
      />

      {/* Styles pour le placeholder */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;