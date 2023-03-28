import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './comicsList.scss';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import useMarvelService from '../../services/MarvelService';

const ComicsList = () => {
    const [listLoaded, setListLoaded] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [offset, setOffset] = useState(0);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset);
    }, []);

    const onRequest = offset => {
        setNewItemLoading(true);
        getAllComics(offset)
            .then(onLoadedData)
    }

    const onLoadedData = (newListLoaded) => {
        setNewItemLoading(false);

        let ended = newListLoaded.lenght < 8;

        setListLoaded([...listLoaded, ...newListLoaded]);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    const ComicsItem = (arr) => {
        const comicsList = arr.map((item, index) => {
            return (
                <li className="comics__item" key={index}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}$</div>
                    </Link>
                </li>
            );
        });

        return (
            <ul className="comics__grid">
                {comicsList}
            </ul>
        );
    }

    const comicsList = ComicsItem(listLoaded);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {comicsList}
            <button
                style={{'display': comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
            >
                <div onClick={() => onRequest(offset)} className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;