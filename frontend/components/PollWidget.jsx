'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, CheckCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function PollWidget({ poll, compact = false }) {
  const { user } = useUserRole();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [results, setResults] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadPollData = useCallback(async () => {
    if (!poll?.id) return;
    
    const supabase = createClient();
    
    // Check if user already voted
    if (user?.id) {
      const { data: vote } = await supabase
        .from('poll_votes')
        .select('option_index')
        .eq('poll_id', poll.id)
        .eq('user_id', user.id)
        .single();
      
      if (vote) {
        setHasVoted(true);
        setSelectedOption(vote.option_index);
      }
    }
    
    // Get vote counts
    const { data: votes } = await supabase
      .from('poll_votes')
      .select('option_index')
      .eq('poll_id', poll.id);
    
    if (votes) {
      const counts = {};
      votes.forEach(v => {
        counts[v.option_index] = (counts[v.option_index] || 0) + 1;
      });
      setResults(counts);
      setTotalVotes(votes.length);
    }
  }, [poll?.id, user?.id]);

  useEffect(() => {
    loadPollData();
  }, [loadPollData]);

  const handleVote = async (optionIndex) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }
    
    if (hasVoted) return;
    
    setLoading(true);
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: poll.id,
          user_id: user.id,
          option_index: optionIndex
        });
      
      if (!error) {
        setHasVoted(true);
        setSelectedOption(optionIndex);
        setResults(prev => ({
          ...prev,
          [optionIndex]: (prev[optionIndex] || 0) + 1
        }));
        setTotalVotes(prev => prev + 1);
        toast.success('Vote recorded!');
      } else {
        toast.error('Failed to vote');
      }
    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Error recording vote');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (optionIndex) => {
    if (totalVotes === 0) return 0;
    return Math.round(((results[optionIndex] || 0) / totalVotes) * 100);
  };

  const options = poll?.options || [];

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <p className="font-medium mb-3 line-clamp-2">{poll?.title}</p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {totalVotes} votes
            </span>
            {hasVoted && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Voted
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {poll?.title}
            </CardTitle>
            {poll?.description && (
              <CardDescription className="mt-1">{poll.description}</CardDescription>
            )}
          </div>
          {poll?.category && (
            <Badge variant="outline">{poll.category}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option, index) => (
          <div key={`poll-option-${poll?.id || 'unknown'}-${index}`}>
            {hasVoted ? (
              // Show results
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className={selectedOption === index ? 'font-medium' : ''}>
                    {option}
                    {selectedOption === index && (
                      <CheckCircle className="h-4 w-4 inline ml-2 text-primary" />
                    )}
                  </span>
                  <span className="font-medium">{getPercentage(index)}%</span>
                </div>
                <Progress value={getPercentage(index)} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {results[index] || 0} votes
                </p>
              </div>
            ) : (
              // Show vote button
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleVote(index)}
                disabled={loading}
              >
                {option}
              </Button>
            )}
          </div>
        ))}
        
        <div className="pt-2 border-t flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {totalVotes} total votes
          </span>
          {poll?.ends_at && (
            <span>
              Ends: {new Date(poll.ends_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
