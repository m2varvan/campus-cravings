import { renderWithDealsProvider, screen, fireEvent, waitFor } from '../../utils/test-utils';
import '@testing-library/jest-dom';
import React from 'react';
import Favourite from './Favourite'


describe('Favourite', () => {

    
    test('If user is not logged in the favourite button is disabled', () => {

        renderWithDealsProvider(<Favourite uuid={null} />);

        const favourite = screen.getByTestId("favourite-empty");
    
        expect(favourite).toBeDisabled();

    });

    test('A logged in user can favourite a deal and the favourite deal/restaurant function is called', () => {

        const saveFave = jest.fn().mockName('saveDeal')
        renderWithDealsProvider(<Favourite uuid={1} fave={false} saveFave={saveFave} />, { uuid: 1 });

        const faveButton = screen.getByTestId('favourite-empty')
        fireEvent.click(faveButton)

        expect(saveFave).toHaveBeenCalled();

        
    });

    test('A logged in user can unfavourinte a deal and the unfavourite deal/restaurant function is called', () => {

        const removeFave = jest.fn().mockName('removeFave')
        renderWithDealsProvider(<Favourite uuid={1} fave={true} removeFave={removeFave} />, { uuid: 1 });

        const faveButton = screen.getByTestId('favourite-filled')
        fireEvent.click(faveButton)

        expect(removeFave).toHaveBeenCalled();


    
    });

    test('An indication of success is shown after a deal/restaurant has been favourited', async () => {

        const saveFave = jest.fn().mockName('saveFave')
        renderWithDealsProvider(<Favourite uuid={1} fave={false} saveFave={saveFave} />, { uuid: 1 });

        const faveButton = screen.getByTestId('favourite-empty')
        fireEvent.click(faveButton)

        await waitFor(() => 
            expect(screen.getByTestId('filled-heart')).toBeInTheDocument()
        );

    });

    test('An indication of success is shown after a deal/restaurant has been unfavourited', async () => {

        const removeFave = jest.fn().mockName('removeFave')
        renderWithDealsProvider(<Favourite uuid={1} fave={true} removeFave={removeFave} />, { uuid: 1 });

        const faveButton = screen.getByTestId('favourite-filled')
        fireEvent.click(faveButton)

        await waitFor(() => 
            expect(screen.getByTestId('empty-heart')).toBeInTheDocument()
        );
        
    });

});
