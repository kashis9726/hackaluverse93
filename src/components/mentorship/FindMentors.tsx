import React from 'react';
import Mentorship from './Mentorship';

const FindMentors: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="sticky top-16 z-20 bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Find Mentors</h1>
                        <p className="text-gray-600">Connect with experienced alumni and mentors</p>
                    </div>
                </div>
            </div>

            {/* Mentorship Component */}
            <Mentorship />
        </div>
    );
};

export default FindMentors;
