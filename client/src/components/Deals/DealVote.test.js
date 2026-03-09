import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import DealVote from './DealVote';

global.fetch = jest.fn();

describe('DealVote', () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test('If user is not logged in total votes are shown but the vote function is disabled', () => {

        render(<DealVote uuid={null} totalVote={3} dealID={1} userVote={null} />);

        expect(screen.getByText('3')).toBeInTheDocument();

        const upvote = screen.getByLabelText(/upvote/i);
        const downvote = screen.getByLabelText(/downvote/i);

        expect(upvote).toBeDisabled();
        expect(downvote).toBeDisabled();
    });

    test('A logged in user can vote thumbs up and the overall vote is updated', async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
        });

        render(<DealVote uuid={1} totalVote={3} dealID={1} userVote={null}/>);

        const upvote = screen.getByLabelText(/upvote/i);
        fireEvent.click(upvote);

        await waitFor(() => {
            expect(screen.getByText('4')).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalled();
    });

    test('A logged in user can vote down and the overall vote is updated', async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
        });

        render(<DealVote uuid={1} totalVote={3} dealID={1} userVote={null}/>);

        const downvote = screen.getByLabelText(/downvote/i);
        fireEvent.click(downvote);

        await waitFor(() => {
            expect(screen.getByText('2')).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalled();
    });

    test('A confirmation message with success is shown after a successful vote', async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
        });

        render(<DealVote uuid={1} totalVote={3} dealID={1} userVote={null}/>);

        fireEvent.click(screen.getByLabelText(/upvote/i));

        await waitFor(() => {
            expect(screen.getByTestId("thumbs-up-filled")).toBeInTheDocument();
        });
    });

    test('An error message with error is shown if the vote fails', async () => {

        fetch.mockResolvedValueOnce({
            ok: false
        });

        render(<DealVote uuid={null} totalVote={3} dealID={1} userVote={null}/>);

        fireEvent.click(screen.getByLabelText(/upvote/i));

        await waitFor(() => {
           expect(screen.getByTestId("thumbs-up-empty")).toBeInTheDocument();
        });
    });

});
